import request from '@/utils/request'

export function getAppointments(data) {
    return request({
        url: '/parlor/orderUsers/list',
        method: 'get',
        params: data
    })
}
export function updateAppointment(data, method) {
    return request({
        url: '/parlor/orderUsers/orderUser',
        method,
        data
    })
}
export function getAppointmentInfo(id) {
    return request({
        url: '/parlor/orderUsers/info/' + id,
        method: 'get',
    })
}