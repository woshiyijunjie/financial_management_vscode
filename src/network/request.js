import axios from 'axios'

//在修改的操作中用了这个作为请求
export function request(config) {
    const instance = axios.create({
      baseURL: 'http://localhost:8888',
      timeout: 5000,
    })
    //注意：这里返回的 instance 本身就是一个 Promise 对象
    return instance(config)
}

// request({
//   url: '/npm/vue@2.6.10/dist/vue.js'
// }).then(res => console.log(res))
