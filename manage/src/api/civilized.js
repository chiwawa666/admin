import request from '@/utils/request'

export function getRule(data) {
  return request({
    url: '/information/list',
    method: 'get',
    params: data
  })
}
export function getRuleInfo(id) {
  return request({
    url: '/information/detail/' + id,
    method: 'get',
  })
}
export function postRule(data) {
  return request({
    url: '/information/add',
    method: 'post',
    data,

  })
}
export function updateRule(data) {
  return request({
    url: '/information/update',
    method: 'post',
    data,

  })
}
export function changeRuleState(id) {
  return request({
    url: '/information/shelf/' + id,
    method: 'get',

  })
}
export function deleteRule(id) {
  return request({
    url: '/information/del/' + id,
    method: 'get',
  })
}
