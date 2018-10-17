import axios from 'axios'
import { Message } from 'element-ui'

axios.defaults.timeout = 1000 * 60

// 添加请求拦截器
axios.interceptors.request.use((config) => {
  return config
}, (error) => {
  Message.error('服务器异常 ' + error.message)
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use((response) => {
  // 对响应数据做些事
  const result = response.data
  if (!result) {
    Message.error('数据异常！')
    return Promise.reject({message: '数据异常！'})
  }
  if (result.retCode === 1) {
    return result.data
  } else if (result.retCode === 0) {
    Message.error(result.errMsg)
    return Promise.reject({message: result.errMsg})
  } else if (result.retCode === -1) { // 未登录
    window.location.href = '/'
  } else if (result.retCode === -2) { // 效验错误
    return Promise.reject({ message: result.errMsg, retCode: -2 })
  }
  return Promise.reject({ message: '未知状态！' })
}, (error) => {
  // 请求错误时提示
  Message.error(error.message)
  return Promise.reject(error)
})
