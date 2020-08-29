<template>
    <el-container>
        <MainSolt>
            <span v-if="user.user_status == 1" slot="title">报账</span>
            <span v-else slot="title">入账</span>
        </MainSolt>

        <el-header>
            <el-input
                placeholder="学生姓名"
                v-model="name"
                prefix-icon="el-icon-search" clearable>
            </el-input>
           
            <el-input
                placeholder="学生学号"
                v-model="number"
                prefix-icon="el-icon-search" clearable>
            </el-input>
            
            <div class="block">
                <el-date-picker
                v-model="searchtime"
                align="right"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择报账日期"
                :picker-options="pickerOptions">
                </el-date-picker>
            </div>

            <el-button type="success" round @click="searchbynnt">查询信息</el-button>
        </el-header>

        <el-main>
            <!-- 显示表格 -->
            <el-table :data="billlist" stripe style="width: 100%"  
            :row-style="{height:'40px'}" 
            :header-row-style="{height:'32px'}"
            :cell-style="{padding:'1px'}">
                <el-table-column
                type="index"
                width="30px">
                </el-table-column>
                <el-table-column
                prop="billName"
                label="学生名称"
                width="120px">
                </el-table-column>
                <el-table-column
                prop="billNumber"
                label="学生学号">
                </el-table-column>
               <el-table-column
                prop="billBankid"
                label="银行账号"
                width="130px">
                </el-table-column>
                <el-table-column
                prop="billTime"
                :formatter="dateFormat"
                label="报账时间">
                </el-table-column>
                <el-table-column
                prop="billSmoney"
                label="应到金额">
                </el-table-column>
                <el-table-column
                prop="billRmoney"
                label="实到金额">
                </el-table-column>
                <!-- 审查状态 -->
                <el-table-column v-if="user.user_status == 1"
                label="是否审核">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                        {{scope.row.billStatus == 0 ? '还未审核' :'已审核'}}
                    </template>
                </el-table-column>
                <!-- 转账情况 -->
                <el-table-column v-if="user.user_status == 1"
                label="转账确认">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.billMoneyStatus" @change="billMoneyStatusChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>

                <!-- 转账确认状态（用户使用） -->
                <el-table-column v-else
                label="转账状态">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                        {{scope.row.billMoneyStatus == false ? '等待转账...' :'已转账'}}
                    </template>
                </el-table-column>

                <el-table-column
                label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" class="el-icon-edit" @click="updatebill(scope.row)">修改</el-button>
                    </template>
                </el-table-column>
                
            </el-table>
            <!-- 分页组件 -->
           <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum"
            :pagesize="queryInfo.pagesize"
            :page-sizes="[8, 6, 4]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>

        </el-main>

    </el-container>
</template>
<script>
import MainSolt from './main_solt/MainSolt'
import {request} from '../../network/request'
//格式化时间工具（注意要引入这个工具才能将毫秒值变为yyyy-MM-dd）
import * as fecha from 'element-ui/lib/utils/date';
export default {
    name: "GetBill",
    created() {
        //生命周期函数中调用方法
        this.getAllBills();
    },
    data() {
        return {
            //姓名
            name: '',
            //学号
            number: '',
            //查询的时间
            searchtime: '',
            //存储所有的账单信息
            billlist: [],
            //总记录数量
            total: 0,
            //用户信息
            user: {},
            //页面信息
            queryInfo: {
                //查询信息
                query: "",
                //查询第几页
                pageNum: 1,
                //规定查询页面的大小
                pageSize: 8,
            },
            //时间选择器
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
        }
    },
    methods: {
        //获取所有的出账信息
        getAllBills() {
            const user = JSON.parse(window.sessionStorage.getItem("user"))
            this.user = user
            let url
            let params
            //如果是管理员
            if(user.user_status == 1) {
                url = '/getAllBill'
                params = {
                    pageNum: this.queryInfo.pageNum,
                    pageSize: this.queryInfo.pageSize,
                }
            //如果是用户
            } else {
                url = '/getAllUserBill'
                params = {
                    pageNum: this.queryInfo.pageNum,
                    pageSize: this.queryInfo.pageSize,
                    uid: this.user.user_id,
                }
            }
            request({
                url,
                params,
                method: 'get',
            }).then(res => {
                //将 billMoneyStatus 转化成 true 和 false
                for(let i = 0; i < res.data.list.length; i++) {
                    res.data.list[i].billMoneyStatus == 0? res.data.list[i].billMoneyStatus = false: res.data.list[i].billMoneyStatus = true
                }
                this.total = res.data.total
                this.billlist = res.data.list
            })
        },
        //根据 1.姓名 2.学号 3.时间 来进行查询
        searchbynnt() {
            const user = JSON.parse(window.sessionStorage.getItem("user"))
            request({
                url:'/getBillByNNT',
                params: {
                    billname: this.name,
                    billnumber: this.number,
                    billtime: this.searchtime,
                    uid: user.user_id,
                }
            }).then(res => {
                //将 billMoneyStatus 转化成 true 和 false
                for(let i = 0; i < res.data.length; i++) {
                    res.data[i].billMoneyStatus == 0? res.data[i].billMoneyStatus = false: res.data[i].billMoneyStatus = true
                }
                this.billlist = res.data
            })
        },
        //转账确认的函数
        billMoneyStatusChanged(data) {
            let billMoneyStatus
            data.billMoneyStatus == true? billMoneyStatus = 1: billMoneyStatus = 0
            if(data.billStatus == 0 && data.billMoneyStatus == true) {
                this.$confirm('信息还没有经过审核，是否确认转账?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    if(res == 'confirm') {
                        this.requestbillMoneyStatusChanged(data.id, billMoneyStatus)
                    }
                }).catch(err => {
                    //取消后执行的方法
                    this.getAllBills()
                })
            } else {
                //响应执行修改操作
                this.requestbillMoneyStatusChanged(data.id, billMoneyStatus)
            }
        },
        requestbillMoneyStatusChanged(id, billMoneyStatus) {
            request({
                url: '/updateBillMoneyStatusById/' + id + '?billMoneyStatus=' + billMoneyStatus,
                method: 'put',
            }).then(res => {
                console.log(res.data)
            })
        },
        //报账信息的修改操作
        updatebill(data) {
            console.log(data)
            this.$router.push({
              path: '/home/billupdate',
              query: {
                  data
              },
            })
        },
        //格式化时间的方法
        dateFormat(row, column, cellValue) {
            return cellValue ? fecha.format(new Date(cellValue), 'yyyy-MM-dd') : '';
        },
        // 页面变化的时候要怎么做
        handleSizeChange(newSize) {
          this.queryInfo.pageSize = newSize
          //从新再调用获取方法刷新数据
          this.getAllBills()
        },
        //pageNum 的触发动作
        handleCurrentChange(newPage) {
          this.queryInfo.pageNum = newPage
          //从新再调用获取方法刷新数据
          this.getAllBills()
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
}
.el-input {
    width: 300px;
}
.el-main {
    text-align: center;
    line-height: 0px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.el-table {
  height: 367px;
  background-color: #E9EEF3;
}
</style>