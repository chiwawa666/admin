import request from '@/utils/request-blob'

//逝者列表 信息导出 
export function exportExcel(params) {
    return request({
        url: '/defunct/export/fireList?',
        method: 'get',
        params
    })
}
