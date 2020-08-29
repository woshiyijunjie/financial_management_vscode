<template>
    <el-container>
        <MainSolt>
            <span slot="title">学生信息</span>
        </MainSolt>

        <el-header>
            <el-input
                placeholder="学号"
                prefix-icon="el-icon-search" v-model="number" clearable>
            </el-input>
            <el-input
                placeholder="姓名"
                prefix-icon="el-icon-search" v-model="name" clearable>
            </el-input>
            <el-button type="success" round @click="search">查询信息</el-button>
        </el-header>

        <el-main>
            <el-table :data="alluserslist" stripe style="width: 100%"  
            :row-style="{height:'40px'}" 
            :header-row-style="{height:'32px'}"
            :cell-style="{padding:'1px'}">

                <el-table-column
                type="index">
                </el-table-column>

                <el-table-column
                prop="number"
                label="学生学号">
                </el-table-column>
                
                <el-table-column
                prop="name"
                label="学生姓名">
                </el-table-column>

                <el-table-column
                prop="sex"
                label="学生性别">
                </el-table-column>

                <el-table-column
                prop="bankid"
                label="银行账号">
                </el-table-column>

                <el-table-column
                prop="email"
                label="邮箱">
                </el-table-column>
            </el-table>
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
import { request } from '../../network/request';
export default {
    name: "Stu",
    created() {
        //生命周期函数中调用方法
        this.getAllUsers();
    },
    data() {
        return {
            name: '',
            number: '',
            //存储所有的出账信息
            alluserslist: [],
            //页面信息
            queryInfo: {
                //查询第几页
                pageNum: 1,
                //规定查询页面的大小
                pageSize: 8,
            },
            //总页面数
            total: 0,
        }
    },
    methods: {
        //获取所有的出账信息
        getAllUsers() {
            request({
                url: '/getAllUsers',
                params: {
                    pageNum: this.queryInfo.pageNum,
                    pageSize: this.queryInfo.pageSize,
                },
                method: 'get',
            }).then(res => {
                for(let i = 0; i < res.data.list.length; i++) {
                    res.data.list[i].sex == 1? 
                    res.data.list[i].sex = '男':
                    res.data.list[i].sex = '女'
                }
                console.log(res.data)
                this.alluserslist = res.data.list
                this.total = res.data.total
            })
        },
        //查询信息
        search() {
            request({
                url: '/getUsersByNN',
                params: {
                    number: this.number,
                    name: this.name,
                },
                method: 'get',
            }).then(res => {
                this.alluserslist = res.data
            })
        },
        // 页面变化的时候要怎么做  
        handleSizeChange(newSize) {
          this.queryInfo.pageSize = newSize
          //从新再调用获取方法刷新数据
          this.getAllUsers()
        },
        //pageNum 的触发动作
        handleCurrentChange(newPage) {
          this.queryInfo.pageNum = newPage
          //从新再调用获取方法刷新数据
          this.getAllUsers()
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