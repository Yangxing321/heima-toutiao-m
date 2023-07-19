// 封装axios请求模块
import axios from 'axios'
import store from '@/store'
// JSONBig.parse()把json格式的字符串转化为对象
// JSONBig.stringify() 把对象转化为字符串
import JSONBig from 'json-bigint'

const request = axios.create({
  baseURL: 'https://toutiao.itheima.net', // 基础路径

  // 直接传参articleId会显示404，需要json-bigint包解决
  // 自定义后端返回的原始数据
  // data: 后端返回的原始数据，说白了就是 JSON 格式的字符串
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }

    // axios 默认会在内部这样来处理后端返回的数据
    // return JSON.parse(data)
  }]
})

// 请求拦截器interceptors
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // 请求发起会经过这里
  // Do something before request is sent
  // config ：本次请求的配置对象
  // config 里面有一个属性：headers
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // 请求出错会进入这里
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器

export default request
