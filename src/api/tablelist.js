
import request from '@/utils/request'
// 获取去上传的权限
export function get_sts_token() {
  // http://winpro3.mrstage.com/api/get/sts/token
  return request({
    url: '/api/get/sts/token',
    method: 'get'
  })
}

// 获取资源列表
export const getfilterdata = data =>
  request.post('/api/get/filter/rows', data)
// 新增资源列表
export const addfilterdata = data =>
  request.post('/api/create/row', data)
// 更新资源列表
export const editfilterdata = data =>
  request.post('/api/update/row/by/id', data)
// 获取行记录详情
export const getfiledetail = data =>
  request.post('/api/get/rows/by/id', data)

// 软删除行记录
export const deleterowid = data =>
  request.post('/api/delete/row/by/id', data)

