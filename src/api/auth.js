import request from '@/utils/request'

export function getAuthList(params) {
  return request({
    url: '/auth/list',
    method: 'post',
    data: params
  })
}

export function authOperate(params) {
  return request({
    url: '/auth/authOperate',
    method: 'post',
    data: params
  })
}

export function detail(id) {
  return request({
    url: '/user/detail',
    method: 'get',
    params: {id}
  })
}

export function batchDel(id) {
  return request({
    url: '/user/batchDel',
    method: 'get',
    params: [id]
  })
}

export function update(params) {
  return request({
    url: '/user/update',
    method: 'post',
    data: params
  })
}
