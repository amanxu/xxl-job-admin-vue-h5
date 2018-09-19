import request from '../utils/request'
import {proxyPrefix} from '../utils/index'

export function getAuthList(params) {
  return request({
    url: proxyPrefix + '/auth/list',
    method: 'post',
    data: params
  })
}

export function authOperate(params) {
  return request({
    url: proxyPrefix + '/auth/authOperate',
    method: 'post',
    data: params
  })
}

export function detail(id) {
  return request({
    url: proxyPrefix + '/user/detail',
    method: 'get',
    params: {id}
  })
}

export function batchDel(id) {
  return request({
    url: proxyPrefix + '/user/batchDel',
    method: 'get',
    params: [id]
  })
}

export function update(params) {
  return request({
    url: proxyPrefix + '/user/update',
    method: 'post',
    data: params
  })
}
