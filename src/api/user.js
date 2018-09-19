import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'post',
    data: params
  })
}

export function create(params) {
  return request({
    url: '/user/create',
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

export function getUserInfo(token) {
  const data = {
    token: token
  }
  return request({
    url: '/user/tokenUserInfo',
    method: 'post',
    data
  })
}


export function batchDel(id) {
  return request({
    url: '/user/batchDel',
    method: 'get',
    params: {id: id}
  })
}

export function update(params) {
  return request({
    url: '/user/update',
    method: 'post',
    data: params
  })
}
