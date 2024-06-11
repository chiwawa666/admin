import request from '@/utils/request'

export function getPeople(data) {
  return request({
    url: '/parlor/orderUsers/list',
    method: 'get',
    params: data
  })
}
export function randomName(id) {
  return request({
    url: '/randomName/list',
    method: 'get',
    params: id
  })
}
export function getPeopleDetail(id) {
  return request({
    url: '/funeral/detail',
    method: 'get',
    params: { id }
  })
}
export function getBlocks(id) {
  return request({
    url: '/block/list',
    method: 'get',
    params: id
  })
}

//骨灰盒管理
export function getCinerarys() { //全部
  return request({
    url: '/parlor/ashes/list',
    method: 'get',
  })
}
export function getCinerarysEmpty() { //空闲
  return request({
    url: '/parlor/ashes/useful/list',
    method: 'get',
  })
}
export function getCinerarysInfo(id) {
  return request({
    url: '/parlor/ashes/info/' + id,
    method: 'get',
  })
}
export function postCinerary(data) {
  return request({
    url: '/parlor/ashes/ashes',
    method: 'post',
    data
  })
}
export function updateCinerarys(data) {
  return request({
    url: '/parlor/ashes/ashes',
    method: 'put',
    data
  })
}
export function deleteCinerarys(id) {
  return request({
    url: '/parlor/ashes/ashes/' + id,
    method: 'delete',
  })
}

//冷冻柜管理
export function getFreezers() { //全部
  return request({
    url: '/parlor/freezer/list',
    method: 'get',
  })
}
export function getFreezersEmpty() { //空闲
  return request({
    url: '/parlor/freezer/useful/list',
    method: 'get',
  })
}
export function getFreezersInfo(id) {
  return request({
    url: '/parlor/freezer/info/' + id,
    method: 'get',
  })
}
export function postFreezer(data) {
  return request({
    url: '/parlor/freezer/freezer',
    method: 'post',
    data
  })
}
export function updateFreezers(data) {
  return request({
    url: '/parlor/freezer/freezer',
    method: 'put',
    data
  })
}
export function deleteFreezers(id) {
  return request({
    url: '/parlor/freezer/freezer/' + id,
    method: 'delete',
  })
}

//订单管理
export function getCineraryOrders(data) {
  return request({
    url: '/parlor/ashesOrder/list',
    method: 'get',
    params: data
  })
}
export function updateCineraryOrder(data) {
  return request({
    url: '/parlor/ashesOrder/ashesOrder',
    method: 'post',
    data
  })
}
export function getCineraryOrderInfo(id) {
  return request({
    url: '/parlor/ashesOrder/info/' + id,
    method: 'get',
  })
}
export function getfreezerOrders(data) {
  return request({
    url: '/parlor/freezerOrder/list',
    method: 'get',
    params: data
  })
}
export function updatefreezerOrders(data) {
  return request({
    url: '/parlor/freezerOrder/freezerOrder',
    method: 'post',
    data
  })
}
export function getOrderInfo(id) {
  return request({
    url: '/parlor/freezerOrder/info/' + id,
    method: 'get',
  })
}

// 车辆
export function getCars() {
  return request({
    url: '/parlor/cars/list',
    method: 'get',
  })
}
export function getCarInfo(id) {
  return request({
    url: '/parlor/cars/info/' + id,
    method: 'get',
  })
}
export function updateCars(data, method) {
  return request({
    url: '/parlor/cars/car',
    method,
    data
  })
}
export function deleteCar(id) {
  return request({
    url: '/parlor/cars/car/' + id,
    method: 'delete',
  })
}

// 司机
export function getDrivers() {
  return request({
    url: '/parlor/drivers/list',
    method: 'get',
  })
}
export function getDriverInfo(id) {
  return request({
    url: '/parlor/drivers/info/' + id,
    method: 'get',
  })
}
export function updateDrivers(data, method) {
  return request({
    url: '/parlor/drivers/driver',
    method,
    data
  })
}
export function deleteDriver(id) {
  return request({
    url: '/parlor/drivers/driver/' + id,
    method: 'delete',
  })
}

//运尸
export function getTransports(data) {
  return request({
    url: '/parlor/carRecords/list',
    method: 'get',
    params: data
  })
}
export function updateTransport(data, method) {
  return request({
    url: '/parlor/carRecords/carRecord',
    method,
    data
  })
}
export function deleteTransportOrder(id) {
  return request({
    url: '/parlor/carRecords/carRecord/' + id,
    method: 'delete',
  })
}

//给司机派单
export function updateTransportOrder(data) {
  return request({
    url: '/parlor/carRecords/carRecord/driver',
    method: 'put',
    data
  })
}
//殡仪馆资源
export function getHome() {
  return request({
    url: '/parlor/parlors/list?',
    method: 'get',
  })
}
export function updateHome(data, method) {
  return request({
    url: '/parlor/parlors',
    method,
    data
  })
}
export function getHomeInfo(id) {
  return request({
    url: '/parlor/parlors/info/' + id,
    method: 'get',
  })
}
export function deleteHome(id) {
  return request({
    url: '/parlor/parlors/' + id,
    method: 'delete',
  })
}


//殡仪服务-产品分类
export function getclassify(data) {
  return request({
    url: '/parlor/category/list',
    method: 'get',
    params: data
  })
}
export function getProductAll(data) {
  return request({
    url: '/parlor/products/list/all',
    method: 'get',
    params: data
  })
}
export function addclassify(data) {
  return request({
    url: '/parlor/category/category',
    method: 'post',
    data: data
  })
}
export function deleteclassify(id) {
  return request({
    url: '/parlor/category/category/' + id,
    method: 'delete',
  })
}

//殡仪服务-产品
export function getProduction(data) {
  return request({
    url: '/parlor/products/list',
    method: 'get',
    params: data
  })
}
export function getProductionFiler(data) {
  return request({
    url: '/parlor/products/list/all',
    method: 'get',
    params: data
  })
}
export function getProductionInfo(id) {
  return request({
    url: '/parlor/products/info/' + id,
    method: 'get',
  })
}
export function updateProduction(data, method) {
  return request({
    url: '/parlor/products/product',
    method,
    data
  })
}
export function deleteProduction(id) {
  return request({
    url: '/parlor/products/product/' + id,
    method: 'delete',
  })
}
//惠民补贴 
export function benefits(params) {
  return request({
    url: '/parlor/finalOrder/list',
    method: 'get',
    params
  })
}
//第三方服务
export function getThird(params) {
  return request({
    url: '/parlor/thirdOrder/list',
    method: 'get',
    params
  })
}
export function getThirdInfo(id) {
  return request({
    url: '/parlor/thirdOrder/info/' + id,
    method: 'get',
  })
}
export function updateThirdState(data) {
  return request({
    url: '/parlor/thirdOrder/state',
    method: 'post',
    data
  })
}


//新增最终清单-车辆调度员新增
export function updatefinalOrder(data, method) {
  return request({
    url: '/parlor/finalOrder/finalOrder',
    method,
    data
  })
}

//排号
export function updateLine(data) {
  return request({
    url: '/parlor/finalOrder/queuing',
    method: "post",
    data
  })
}
//暂存服务
export function cacheService(data) {
  return request({
    url: '/parlor/finalOrder/cache',
    method: "post",
    data
  })
}
//获取暂存服务
export function getCacheService(id) {
  return request({
    url: '/parlor/finalOrder/cache?finalOrderNo=' + id,
    method: 'get',
  })
}


//缴费
export function pay(data) {
  return request({
    url: '/parlor/finalOrder/end',
    method: "post",
    data
  })
}

//火化信息
export function firePage(params) {
  return request({
    url: '/defunct/info/firePage',
    method: 'get',
    params
  })
}
//生成火化证明
export function burned(id) {
  return request({
    url: '/defunct/fire/cert/generate?defunctId=' + id,
    method: 'get',
  })
}
//查看火化证明
export function checkburned(id) {
  return request({
    url: '/defunct/fire/cert/detail?defunctId=' + id,
    method: 'get',
  })
}
//查看身份信息
export function checkInfo(id) {
  return request({
    url: '/defunct/fire/identity/generate?defunctId=' + id,
    method: 'get',
  })
}


// 流程查看
export function process(id) {
  return request({
    url: '/defunct/process/detail?defunctId=' + id,
    method: 'get'

  })
}


//根据冷冻柜d查看全部冷冻柜预约记录 
export function checkAppointment(id, params) {
  return request({
    url: '/parlor/freezerOrder/info/' + id,
    method: 'get',
    params
  })
}


//商家
export function merchants(params) {
  return request({
    url: '/business/list',
    method: 'get',
    params
  })
}
export function addMerchant(data) {
  return request({
    url: '/business/business',
    method: "post",
    data
  })
}
export function updateMerchant(data) {
  return request({
    url: '/business/business',
    method: "put",
    data
  })
}
export function deleteMerchant(id) {
  return request({
    url: '/business/business/' + id,
    method: 'delete',
  })
}
