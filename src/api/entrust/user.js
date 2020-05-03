import request from '@/utils/request'

// 查询委托人列表
export function listUser(query) {
  return request({
    url: '/entrust/user/list',
    method: 'get',
    params: query
  })
}

// 查询委托人详细
export function getUser(id) {
  return request({
    url: '/entrust/user/' + id,
    method: 'get'
  })
}

// 新增委托人
export function addUser(data) {
  return request({
    url: '/entrust/user',
    method: 'post',
    data: data
  })
}

// 修改委托人
export function updateUser(data) {
  return request({
    url: '/entrust/user',
    method: 'put',
    data: data
  })
}

// 删除委托人
export function delUser(id) {
  return request({
    url: '/entrust/user/' + id,
    method: 'delete'
  })
}

// 导出委托人
export function exportUser(query) {
  return request({
    url: '/entrust/user/export',
    method: 'get',
    params: query
  })
}
// 导出模板
export function exportModel() {
  return request({
    url: '/entrust/user/export/model',
    method: 'get'
  })
}
