import Vue from 'vue'
import Vuex from 'vuex'
//引入持久化插件
import createPersistedState from "vuex-persistedstate";
import {request} from '../network/request'

Vue.use(Vuex)
//可以装一个持久化插件 npm install --save vuex-persistedstate
export default new Vuex.Store({
  state: {
    user: {
      user_id: '',
      user_number: '',
      user_name: '',
      user_bankid: '',
      user_status: '',
    }
  },
  mutations: {
    //刚开始登陆的时候数据初始化
    updateUserData(state, payload) {
      state.user.user_id =  payload.user_id
      state.user.user_number = payload.user_number
      state.user.user_name = payload.user_name
      state.user.user_bankid = payload.user_bankid
      state.user.user_status = payload.user_status
    }
  },
  actions: {
    
  },
  getters: {
  },
  modules: {
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage
})]

})
