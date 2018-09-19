import request from '@/utils/request'
import {proxyPrefix} from '../utils/index'

export function getGroupList(params) {
  return request({
    url: proxyPrefix + '/jobgroup/list',
    method: 'post',
    data: params
  })
}

export function getGroupListAll() {
  return request({
      url: proxyPrefix + '/jobgroup/listAll',
      method: 'get'
    }
  )
}

export function create(params) {
  return request({
    url: proxyPrefix + '/jobgroup/save',
    method: 'post',
    data: params
  })
}

export function remove(id) {
  return request({
    url: proxyPrefix + '/jobgroup/remove',
    method: 'get',
    params: {id: id}
  })
}

export function update(params) {
  return request({
    url: proxyPrefix + '/jobgroup/update',
    method: 'post',
    data: params
  })
}
