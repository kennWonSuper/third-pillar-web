import request from '@/utils/request'

// 查询养老计划列表
export function listPlan(query) {
  return request({
    url: '/plan/plan/list',
    method: 'get',
    params: query
  })
}

// 查询养老计划详细
export function getPlan(planId) {
  return request({
    url: '/plan/plan/' + planId,
    method: 'get'
  })
}

// 新增养老计划
export function addPlan(data) {
  return request({
    url: '/plan/plan',
    method: 'post',
    data: data
  })
}

// 修改养老计划
export function updatePlan(data) {
  return request({
    url: '/plan/plan',
    method: 'put',
    data: data
  })
}

// 删除养老计划
export function delPlan(planId) {
  return request({
    url: '/plan/plan/' + planId,
    method: 'delete'
  })
}

// 导出养老计划
export function exportPlan(query) {
  return request({
    url: '/plan/plan/export',
    method: 'get',
    params: query
  })
}
