import request from '@/utils/request'

// 查询部门列表
export function listInfo(query) {
  return request({
    url: '/org/qfen/list',
    method: 'get',
    params: query
  })
}

// 查询部门详细
export function getInfo(deptId) {
  return request({
    url: '/org/qfen/' + deptId,
    method: 'get'
  })
}

// 新增部门
export function addInfo(data) {
  return request({
    url: '/org/qfen',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateInfo(data) {
  return request({
    url: '/org/qfen',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delInfo(deptId) {
  return request({
    url: '/org/qfen/' + deptId,
    method: 'delete'
  })
}

// 导出部门
export function exportInfo(query) {
  return request({
    url: '/org/qfen/export',
    method: 'get',
    params: query
  })
}
