import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://192.168.96.1:8080',
  timeout: 10000
})

request.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, error => {
  Message.error({message: error})
  return Promise.reject(error)
})

// 拦截器，ajax失败是消息提示
request.interceptors.response.use(res => {
  if (res.data.status === 200) {
    return res
  } else if (res.data.status === 401) {
    MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      sessionStorage.removeItem('token')
      store.commit('clearUserInfo')
      location.reload()
    })
  } else {
    Message.error({message: res.data.error})
    return Promise.reject(res.data.error)
  }
}, error => {
  Message.error({message: error})
  return Promise.reject(error)
})

export default request
