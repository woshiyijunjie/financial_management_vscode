import Vue from 'vue'
import VueRouter from 'vue-router'

//引入Login组件
const Login = () => import ('../components/Login')
const Home = () => import ('../components/Home')
//主页面中的组件
const HomePage = () => import ('../components/home_main/HomePage')
const GetBill = () => import ('../components/home_main/GetBill')
const OutBill = () => import ('../components/home_main/OutBill')
const Stu = () => import ('../components/home_main/Stu')
const SetMine = () => import ('../components/home_main/SetMine')
const Add = () => import ('../components/add_edit_visible/Add')
const Update = () => import ('../components/add_edit_visible/Update')
const BillUpdate = () => import('../components/add_edit_visible/BillUpdate')

//解决重复点击报红的问题
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

  const routes = [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/home",
      component: Home,
      //注意下面不要加 '/'
      children: [
        {
          path: "",
          redirect: "/home/homepage",
        },
        {
          path: "homepage",
          component: HomePage,
        },
        {
          path: "getbill",
          component: GetBill
        },
        {
          path: "outbill",
          component: OutBill
        },
        {
          path: "stu",
          component: Stu
        },
        {
          path: "setmine",
          component: SetMine
        },
        {
          path: "add",
          component: Add
        },
        {
          path: "update",
          component: Update
        },
        {
          path: "billupdate",
          component: BillUpdate
        }
        
      ]
    }
  ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//挂在路由导航守卫（监视着路由跳转时浏览器数据是否存在）
router.beforeEach((to, from, next) => {
  if(to.path == '/login') return next()
  //获取user
  const user_id_name = window.sessionStorage.getItem("user")//取出当前的用户
  //console.log(user_id_name)
  if(!user_id_name) return next('/login')//无值返回登陆页面
  next()//符合要求放行
})
export default router
