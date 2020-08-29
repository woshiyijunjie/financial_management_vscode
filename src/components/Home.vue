<template>
      <!-- 引入布局 -->
      <el-container>
        <!-- 头部 -->
        <el-header>
            <div class="left_header">
                <img src="../assets/logo.jpg" alt=""/>
                <span class="testroom">实验室账务管理系统</span>
            </div>
            <div class="right_header">
                <span >欢迎你 {{user_name}}</span>
                <el-button class="backbtn" type="primary" @click="logout">安全退出</el-button>
            </div>
        </el-header>
        <el-container>
            <!-- 侧边栏 -->
            <el-aside width="250px">
                <Navmenu :menulist="menulist"></Navmenu>
            </el-aside>
            <el-container>
            <!-- 主体部分  <keep-alive></keep-alive> 慎用-->
            <el-main>
                <router-view></router-view>
            </el-main>
            <!-- 底部 -->
            <el-footer>版权所有，禁止盗版</el-footer>
            </el-container>
        </el-container>
      </el-container>
</template>
<script>

import Navmenu from './home_side/Navmenu'
export default {
    name: "Home",
    data() {
        return {
           menulist: [],
        }
    },
    created() {
        this.getMenuList()
    },
    methods: {
        logout() {
            //先清除在浏览器中留下的所有用户信息
            window.sessionStorage.clear()//清除浏览器中存储的 sessionStorage
            this.$router.push("/login")
            this.$message.success("你已经成功退出！")
        },
        //获取表单列表 (这个方法在)
        async getMenuList() {
            //拿到 mid (以此来查询用户的权限菜单)
            const status = JSON.parse(window.sessionStorage.getItem("user")).user_status
            const {data: res} = await this.$http.get("/getMenu",{params:{status:status,}})
            //存储到 menulist中
            this.menulist = res.menus
            console.log('拿到的菜单栏数据')
            console.log(res)
        }

    },
    components: {
        // 侧边栏的组件
        Navmenu,
    },
    computed: {
        user_name() {
            const user = JSON.parse(window.sessionStorage.getItem("user"))
            // console.log('路由传递过来的参数')
            // console.log(this.$route.query.user)
            return user.user_name
        },
        //通过路由跳转传递信息
        // user() {
        //   return this.$route.query.user
        // },
        // user_name() {
        //   return this.$route.query.user.name
        // }
    },
   
}
</script>
<style scoped>
.el-container {
    height: 100%;
}

.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-size: 22px;
    align-items: center;
}

.el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #fff;
    color: #333;
    text-align: center;
    line-height: 200px;
    /* border:0px solid #E6E6E6; */
}

.el-main {
background-color: #E9EEF3;
color: #333;
text-align: center;
line-height: 160px;
}

/* 导航栏左边一块样式 */
.left_header {
    display: flex;
    justify-content: space-between;
    font-size: 22px;
    align-items: center;
}

img {
    width: 55px;
    height: 55px;
}

.testroom {
    margin-left: 20px;
}
/* 导航栏右边一块样式 */
.right_header {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    align-items: center;
}
.backbtn {
    height: 80%;
    margin-left: 30px;
}
/* ----------------- */
</style>