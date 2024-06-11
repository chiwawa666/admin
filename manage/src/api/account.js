import request from '@/utils/request'

export function getAccounts(params) {
    return request({
        url: '/admin/manage/adminList',
        method: 'get',
        params
    })
}
export function getRoles() {
    return request({
        url: '/role/getRoleList',
        method: 'get',
    })
}
export function updateState(params) {
    return request({
        url: '/admin/manage/changeAdmin',
        method: 'put',
        params
    })
}

//新建管理人
export function updateAccounts(data, method) {
    return request({
        url: '/admin/manage/admin',
        method,
        data
    })
}


//获取街道和公墓关系
export function getRelationship() {
    return request({
        url: '/cemetery/relationship/0',
        method: 'get',
    })
}