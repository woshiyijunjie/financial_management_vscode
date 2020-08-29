<template>
    <el-container>
        <MainSolt>
            <span slot="title">出账</span>
        </MainSolt>

        <el-header>

            <el-input v-if="user.user_status == 1"
                placeholder="学生姓名"
                prefix-icon="el-icon-search" v-model="name" clearable>
            </el-input>

            <el-input v-else
                placeholder="物品名称"
                prefix-icon="el-icon-search" v-model="goodsname" clearable>
            </el-input>
            
            <el-input v-if="user.user_status == 1"
                placeholder="学生学号"
                prefix-icon="el-icon-search" v-model="number" clearable>
            </el-input>

            <el-input v-else
                placeholder="物品类别"
                prefix-icon="el-icon-search" v-model="goodskind" clearable>
            </el-input>
            
            <div class="block">
                <el-date-picker
                v-model="searchtime"
                align="right"
                type="date"
                placeholder="选择购买日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions">
                </el-date-picker>
            </div>

            <el-button v-if="user.user_status == 1" type="success" round @click="adminGetSearchMessage">查询信息</el-button>
            <el-button v-else type="success" round @click="getSearchMessage">查询信息</el-button>
            <el-button v-if="user.user_status != 1" round icon="el-icon-plus" @click="add">添加</el-button>
          
        </el-header>

        <el-main>
          <!-- 显示表格 -->
            <el-table :data="goodslist" stripe style="width: 100%"  
            :row-style="{height:'40px'}" 
            :header-row-style="{height:'32px'}"
            :cell-style="{padding:'1px'}">
            <el-table-column
              type="index"
              width="30px">
            </el-table-column>
            <!-- 如果是管理员就显示，如果是用户就不显示 -->
            <el-table-column v-if="user.user_status == 1"
              prop="name"
              label="学生姓名"
              width="120px">
            </el-table-column>
            <el-table-column v-if="user.user_status == 1"
              prop="number"
              label="学生学号">
            </el-table-column>

            <el-table-column
              prop="goodsName"
              label="物品名称"
              width="120px">
            </el-table-column>
            <el-table-column
              prop="goodsKind"
              label="物品类别">
            </el-table-column>
            <el-table-column
              prop="goodsMoney"
              label="花费金额">
            </el-table-column>
            <el-table-column
              prop="goodsBuyTime"
              :formatter="dateFormat"
              label="购买时间">
            </el-table-column>
            <el-table-column
              prop="goodsUpTime"
              :formatter="dateFormat" 
              label="发票上传时间">
            </el-table-column>

            <!-- 这里也要根据是管理员或者用户来决定是否显示 -->
            <el-table-column v-if="user.user_status == 1"
              label="审核确认">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                  <!--{{scope.row}}可以拿到每一行的所有数据 注意@change 更改调用 -->
                <el-switch v-model="scope.row.goodsStatus" @change="goodsStatusChanged(scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column v-else
              label="审核情况">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                 {{scope.row.goodsStatus == true ? '审核成功!' :'审核中...'}}
              </template>
            </el-table-column>

            <el-table-column 
              v-if="user.user_status == 1"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" class="el-icon-search" @click="checkbill(scope.row.goodsUpTime)">发票</el-button>
                <el-button type="text" size="small" class="el-icon-delete" @click="deleteGoodsById(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column 
              v-else
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" class="el-icon-edit" @click="updateUserGoods(scope.row)">修改</el-button>
                <el-button type="text" size="small" class="el-icon-delete" @click="deleteGoodsById(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>

           <!-- 分页组件 -->
           
           <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum"
            :page-sizes="[8, 6, 4]"
            :pagesize="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        
        </el-main>
    </el-container>
</template>
<script>
import MainSolt from './main_solt/MainSolt'
//格式化时间工具
import * as fecha from 'element-ui/lib/utils/date'
//导入 request.js
import {request} from '../../network/request'

export default {
    name: "OutBill",
    //created只能调用一次 这里也可以用页面跳转后刷新的手法 window.location.reload();
    created() {
        //生命周期函数中调用方法
        this.getGoods();
    },
    data() {
        return {
            //查询操作所需要的参数定义
            //物品名称
            goodsname: '',
            //物品种类
            goodskind: '',
            //用户姓名
            name: '',
            //学生学号
            number: '',
            //选择的时间信息
            searchtime: '',
            //el-dialog是否显示出
            dialogVisible: false,
            //显示的图片 url
            dialogImageUrl: '',
            pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
            shortcuts: [{
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date());
              }
            }, {
              text: '昨天',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
              }
            }, {
              text: '一周前',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
              }
            }]
          },
          //页面信息
          queryInfo: {
            //查询信息
            query: "",
            //查询第几页
            pageNum: 1,
            //规定查询页面的大小
            pageSize: 8,
          },
          //存储所有查出的出账信息
          goodslist: [],
          //总记录数量
          total: 0,
          //记录登陆的信息(这里从 sessionStorage 中获取)
          user: {},
        }
    },
    methods: {
        //获取所有的出账信息
        async getGoods() {
            const user = JSON.parse(window.sessionStorage.getItem("user"))
            //赋值在上面的表格中使用
            this.user = user
            //管理员
            if(user.user_status == 1) {
              const {data: res} = await this.$http.get(
                  "/getAllGoods",
                  {
                      params:{
                          "pageNum": this.queryInfo.pageNum,
                          "pageSize": this.queryInfo.pageSize,
                      }
                  }
              )
              //将 1 和 0 换成 true 和 false ()根据后台数据控制开关
              console.log('拿到列表和分页的数据')
              console.log(res)
              for(let i = 0; i < res.list.length; i++) {
                if(res.list[i].goodsStatus == 1) res.list[i].goodsStatus = true
                else res.list[i].goodsStatus = false
                //变换数据类型
                res.list[i].goodsUpTime = Number(res.list[i].goodsUpTime)
              }
              //------------------------------------------------
              this.goodslist = res.list
              this.total = res.total
            } else if(user.user_status == 0){
                //普通用户
                const {data: res} = await this.$http.get(
                "/getCurrentUserAllGoods",
                {
                    params:{
                        pageNum: this.queryInfo.pageNum,
                        pageSize: this.queryInfo.pageSize,
                        //只查询当前的用户
                        id: user.user_id,
                    }
                }
            )
            console.log('拿到列表和分页的数据')
            console.log(res)
             //将 1 和 0 换成 true 和 false ()根据后台数据控制开关
            for(let i = 0; i < res.list.length; i++) {
              if(res.list[i].goodsStatus == 1) res.list[i].goodsStatus = true
              else res.list[i].goodsStatus = false
              //变换数据类型
              res.list[i].goodsUpTime = Number(res.list[i].goodsUpTime)
            }
            this.goodslist = res.list
            this.total = res.total
            }
        },

        //修改 goods 的 status 状态
        async goodsStatusChanged(data) {
          console.log(data)
          //将数据转化回去
          let flag
          data.goodsStatus == true? flag = 1: flag = 0
          //这里用 ‘ ` ’ 这里符号才可以解析
          await this.$http.put(`/updateGoodsStatus/${data.id}?bid=${data.bid}&goodsstatus=${flag}`)
        },
        //普通用户根据 1.物品名称 2.物品类别 3.购买时间进行查询
        async getSearchMessage() {
          const user = JSON.parse(window.sessionStorage.getItem("user"))
          //console.log(this.goodsname + " " + this.goodskind + " " + this.searchtime)
          //这里空的 null 数据响应的话后台是无法接受的
          //if(this.searchtime == null) this.searchtime = ''
          //这个问题的结决可以在 @RequestParam(value = "time", required = false) 中加上注解
          const {data: res} = await this.$http.get('/selectCurrentUserGoodsByNKT', {
            params: { 
                uid: user.user_id,
                goodsname: this.goodsname,
                goodskind: this.goodskind,
                time: this.searchtime,
              }
            }
          )
          //将里面的一些数据进行改变 才能够显示 status 和 时间数据 
          //(一个是 switch 按钮 一个是时间转化用来存图片)
            for(let i = 0; i < res.length; i++) {
              if(res[i].goodsStatus == 1) res[i].goodsStatus = true
              else res[i].goodsStatus = false
              //变换数据类型
              res[i].goodsUpTime = Number(res[i].goodsUpTime)
            }
          //刷新数据
          this.goodslist = res
        },
        //管理员根据 1.学生姓名 2.学生学号 3.购买时间来进行查询
        adminGetSearchMessage() {
           console.log(this.searchtime)
            request({
                url: '/selectAllGoodsByNKT',
                method: 'get',
                params: {
                  name: this.name,
                  number: this.number,
                  goodsbuytime: this.searchtime,
                }
            }).then(res => {
                //变换两个数据类型好方便用来显示
                for(let i = 0; i < res.data.length; i++) {
                  if(res.data[i].goodsStatus == 1) res.data[i].goodsStatus = true
                  else res.data[i].goodsStatus = false
                  //变换数据类型
                  res.data[i].goodsUpTime = Number(res.data[i].goodsUpTime)
                }
                //刷新数据
                this.goodslist = res.data
            })
        },
        //学生的删除操作
        async deleteGoodsById(data) {
          const confirmResult = await this.$confirm('是否确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)

          if(confirmResult == 'confirm') {
            //执行删除响应
            const {data: res} = await this.$http.delete(`/deleteGoodsById?id=${data.id}&bid=${data.bid}`)
            if(res > 0) {
              this.$message.success("删除成功!")
            //刷新数据
              this.getGoods();
            }else {
              this.$message.success("删除失败!")
            }
          }
        },
        //管理员查看出账图片的方法
        checkbill(goodsUpTime) {
          this.dialogVisible = true
          this.dialogImageUrl = 'http://localhost:8888/images/'+ goodsUpTime +'.jpg'
        },
        //跳转额操作--------------------------------------------------
        //跳转到添加页面
        add() {
            this.$router.push({
              path: '/home/add',
            })
        },
        //用户的修改操作
        updateUserGoods(data) {
            //console.log(data)
            //用路由跳转将信息跳转到修改界面
            this.$router.push({
              path: '/home/update',
              query: {
                data
              }
            })
        },
        //----------------------------------------------------------------------
        //格式化时间的方法
        dateFormat(row, column, cellValue) {
            return cellValue ? fecha.format(new Date(cellValue), 'yyyy-MM-dd') : '';
        },

        // 页面变化的时候要怎么做
        handleSizeChange(newSize) {
          this.queryInfo.pageSize = newSize
          //从新再调用获取方法刷新数据
          this.getGoods()
        },
        //pageNum 的触发动作
        handleCurrentChange(newPage) {
          this.queryInfo.pageNum = newPage
          //从新再调用获取方法刷新数据
          this.getGoods()
        },
       
       
    },
    components: {
        MainSolt,
    }
}
</script>
<style scoped>
.el-container {
    height: 100%;
}
.el-header {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    align-items: center;
    /* border: 1px solid red; */
}
.el-input {
    width: 300px;
}
.el-main {
    text-align: center;
    /* 这个要注意 这个默认属性会覆盖一部分区域*/
    line-height: 0px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.el-table {
  height: 367px;
  background-color: #E9EEF3;
}
</style>