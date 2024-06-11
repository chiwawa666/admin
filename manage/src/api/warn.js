import request from '@/utils/request'

export function getGraveLack(data) {
    return request({
        url: '/warning/graveLack/list',
        method: 'get',
        params: data
    })
}
export function getRemainsCold(data) {
    return request({
        url: '/warning/remainsCold/list',
        method: 'get',
        params: data
    })
}
export function getBuryWarning(data) {
    return request({
        url: '/warning/buryWarning/list',
        method: 'get',
        params: data
    })
}
export function modifyStatus(id) {
    return request({
        url: '/warning/handleWarn?warnId=' + id,
        method: 'get',
    })
}
