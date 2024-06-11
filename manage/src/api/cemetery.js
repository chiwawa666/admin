import request from '@/utils/request'

export function getCemeterys() {
  return request({
    url: '/cemetery/manage/getCemeteryList/byRole',
    method: 'get',
  })
}
//获取公墓墓区及墓穴统计
export function getTombAndGraveDetail(id) {
  return request({
    url: '/cemetery/manage/getTombAndGraveDetail?cemeteryId=' + id,
    method: 'get',
  })
}
//获取墓区下墓穴分布
export function getTombGraveDetail(id) {
  return request({
    url: '/tomb/manage/getTombGraveDetail?tombId=' + id,
    method: 'get',
  })
}
//获取公墓详情页数据
export function getTombGraveStatics(id) {
  return request({
    url: '/cemetery/statics/' + id,
    method: 'get',
  })
}
//墓穴信息
export function getGraveDetails(id) {
  return request({
    url: '/grave/getGraveDetails?graveId=' + id,
    method: 'get',
  })
}
