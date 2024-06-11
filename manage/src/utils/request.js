import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // console.log(config.method);
    // do something before request is sent
    // config.headers['Accept'] = "application/json"
    if (config.method === 'post' || config.method === 'put') {
      config.headers['Content-Type'] = 'application/json'
    } else {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    let privateCodeTime = localStorage.getItem('privateCodeTime')
    let nowStamp = new Date().getTime()
    if (nowStamp - privateCodeTime < 300000) {
      config.headers['Interface'] = localStorage.getItem('privateCode')
    }
    if (store.getters.token && (config.url.indexOf('login/token') === -1)) {
      config.headers['Authorization'] = getToken()
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // console.log(response);
    if (res.code !== 1) {

      if (res.code === 20006) {
        //登录超时
        // return
        console.log('20006');
        if (response.request.responseURL.indexOf('login/token') === -1) {
          return store.dispatch('user/reLogin').then(() => {
            const { url, method, headers, data } = response.config;
            headers['Authorization'] = getToken()
            let newConfigRequest = {}
            if (data == undefined) {
              newConfigRequest = {
                url,
                method,
                headers,
              };
            } else {
              newConfigRequest = {
                url,
                method,
                headers,
                data,
                // 可以根据需要添加其他配置选项  
              };
            }
            // 创建一个新的请求配置对象  
            // console.log('newConfigRequest', newConfigRequest);
            return axios(newConfigRequest)
              .then(newResponse => {
                console.log('重新发送成功');
                if (newResponse.data.code === 20006) {
                  console.log(newResponse) // for debug
                  this.$router.push(`/login?redirect=${this.$route.fullPath}`);
                  window.location.reload();
                  // return Promise.reject(newResponse.data.message || 'Error')
                }
                return newResponse.data;
              })
              .catch(error => {
                // 处理错误  
                console.log('重新发送失败');
                console.log('error', error);
              });
          })
        }
        // else {
        //   return Promise.reject(res.message || 'Error')

        // }

      } else if (res.code == 40001) {
        return Promise.reject(new Error(res.msg || 'Error'))
      } else if (res.code == 50010) {
        let dep = JSON.parse(res.result).join('、')
        Message({
          message: res.msg + '(' + dep + ')',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.msg || 'Error'))
      } else if (res.code == 20001) { // 登录过期
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
        setTimeout(() => {
          this.$router.push(`/login?redirect=${this.$route.fullPath}`);
          window.location.reload();
        }, 500);
      } else {
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.msg || 'Error'))
        // return res
      }

      // return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (error == 'Error: timeout of 5000ms exceeded') {
      Message({
        message: "访问超时，请稍后重试",
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: '系统异常，请稍后重试',
        type: 'error',
        duration: 5 * 1000
      })
    }

    return 'Promise.reject(error)'
  }
)

export default service
