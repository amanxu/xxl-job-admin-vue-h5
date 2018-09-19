import request from '@/utils/request'

export function getGroupList(params) {
  return request({
    url: '/jobgroup/list',
    method: 'post',
    data: params
  })
}

export function getGroupListAll() {
  return request({
      url: '/jobgroup/listAll',
      method: 'get'
    }
  )
}

export function create(params) {
  return request({
    url: '/jobgroup/save',
    method: 'post',
    data: params
  })
}

export function remove(id) {
  return request({
    url: '/jobgroup/remove',
    method: 'get',
    params: {id: id}
  })
}

export function update(params) {
  return request({
    url: '/jobgroup/update',
    method: 'post',
    data: params
  })
}
