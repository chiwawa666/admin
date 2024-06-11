import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/files/qiniu/token',
    method: 'get'
  })
}
export function upload(data) {
  return request({
    url: '/files/upload',
    method: 'post',
    params: data,
  })
}
