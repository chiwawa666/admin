import request from '@/utils/request'

export function getPeopleList(data) {
  return request({
    url: '/defunct/info/page',
    method: 'get',
    params: data
  })
}
export function getPeopleDetail(id) {
  return request({
    url: '/defunct/info/details?defunctId=' + id,
    method: 'get',
    // params: { id }
  })
}
export function updatePeopleDetail(data) {
  return request({
    url: '/defunct/info/update',
    method: 'post',
    data
  })
}

//根据逝者id获取最终清单详情
export function getFinalInfo(id) {
  return request({
    url: '/parlor/finalOrder/defunct/' + id,
    method: 'get',
  })
}
export function getFinalOrder(id) {
  return request({
    url: '/parlor/finalOrder/info/' + id,
    method: 'get',
  })
}

//骨灰流向
export function getBoneashRecord(id) {
  return request({
    url: '/boneashRecord/list?defunctid=' + id,
    method: 'get',
  })
}