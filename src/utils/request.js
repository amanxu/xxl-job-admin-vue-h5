import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '../store'
import {getToken} from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  //api的base_url 不使用代理时配置此字段
  /*baseURL: process.env.BASE_API,*/
  headers: {
    'content-type': 'application/json',
    'api-version': '1.0.0'
  },
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
    if (store.getters.token) {
      // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['AuthToken'] = getToken()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    Promise.reject(error)
  })

// response 拦截器
service.interceptors.response.use(response => {
    const res = response.data
    if (res.code === 200 || res.code === 0) {
      return response.data
    }
    // 900100:Token无效; 900101:Token过期;
    if (res.code === 900100 || res.code === 900101) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '登出确认', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取 消',
        center: true,
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      })
      return
    }
    Message({
      message: res.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject('error')
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
