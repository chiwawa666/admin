import request from '@/utils/request'

export function itemsList(query) {
  return request({
    url: '/case/type/list',
    method: 'get',
    params: query
  })
}

export function managerList(query) {
  return request({
    url: '/case/manage/admin/list',
    method: 'get',
    params: query
  })

}
export function addmanager(data) {
  return request({
    url: '/case/manage/admin/add',
    method: 'post',
    data
  })
}
export function addItems(data) {
  return request({
    url: '/case/type/insert',
    method: 'post',
    data
  })
}
export function updateItems(data) {
  return request({
    url: '/case/type/update',
    method: 'post',
    data
  })
}
export function updatemanager(data) {
  return request({
    url: '/case/manage/admin/update',
    method: "post",
    data
  })
}
export function deleteItems(id) {
  return request({
    url: '/case/type/del/' + id,
    method: 'get',
  })
}
export function deleteManager(id) {
  return request({
    url: '/case/manage/admin/del/' + id,
    method: 'get',
  })
}

export function departmentList() {
  return request({
    url: '/case/manage/admin/parmdent',
    method: 'get',
  })
}

export function illegalList(query) {
  return request({
    url: '/case/manage/list',
    method: 'get',
    params: query
  })
}
export function illegalListDetail(id) {
  return request({
    url: 'case/manage/info/' + id,
    method: 'get',
    // params: { id }
  })
}

export function typeList() {
  return request({
    url: '/case/manage/type/',
    method: 'get',
    // params: { id }
  })
}
export function caseRecord(id) {
  return request({
    url: '/case/manage/record/' + id,
    method: 'get',
    // params: { id }
  })
}

export function partmentList(id) {
  return request({
    url: '/case/manage/partment/' + id,
    method: 'get',
    // params: { id }
  })
}
export function postOrder(data) {
  return request({
    url: '/case/manage/caseAssign',
    method: 'post',
    data: data
  })
}

//村级 树形结构
export function allcity(id) {
  return request({
    url: '/common/allcity',
    method: 'get',
  })
}
//案件一级分类
export function FirstTypeList() {
  return request({
    url: '/case/type/one/list',
    method: 'get',
  })
}
export function addTypeList(data) {
  return request({
    url: '/case/type/one/add',
    method: 'post',
    data
  })
}
export function handleCase(data) {
  return request({
    url: '/case/manage/check',
    method: 'post',
    data
  })
}
export function refuseCase(data) {
  return request({
    url: '/case/manage/refuse',
    method: 'post',
    data
  })
}
export function finishCase(data) {
  return request({
    url: '/case/manage/end',
    method: 'post',
    data
  })
}
export function uploadCase(data) {
  return request({
    url: '/case/manage/submit',
    method: 'post',
    data
  })
}