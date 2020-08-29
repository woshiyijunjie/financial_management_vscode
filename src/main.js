import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/global.css'
import axios from 'axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//挂在 axios (挂在之后任意组件内就可以使用)
Vue.prototype.$http = axios
//设置访问根路径
axios.defaults.baseURL = 'http://localhost:8888'

Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
