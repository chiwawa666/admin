import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/token',
    method: 'post',
    params: data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}


export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

//

// export function login(data) {
//   return request({
//     url: '/login/token',
//     method: 'post',
//     params: data
//   })
// }

export function reLogin(data) {
  return request({
    url: '/login/token',
    method: 'post',
    params: data
  })
}




export function partmentList() {
  return request({
    url: '/case/manage/partment/6',
    method: 'get'
  })
}
export function getPrivateCode() {
  return request({
    url: '/login/interface',
    method: 'post'
  })
}
