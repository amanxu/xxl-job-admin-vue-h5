import request from '@/utils/request'
import {proxyPrefix} from '../utils/index'

export function getUserList(params) {
  return request({
    url: proxyPrefix +'/user/list',
    method: 'post',
    data: params
  })
}

export function create(params) {
  return request({
    url: proxyPrefix +'/user/create',
    method: 'post',
    data: params
  })
}

export function detail(id) {
  return request({
    url: proxyPrefix +'/user/detail',
    method: 'get',
    params: {id}
  })
}

export function getUserInfo(token) {
  const data = {
    token: token
  }
  return request({
    url: proxyPrefix +'/user/tokenUserInfo',
    method: 'post',
    data
  })
}


export function batchDel(id) {
  return request({
    url: proxyPrefix +'/user/batchDel',
    method: 'get',
    params: {id: id}
  })
}

export function update(params) {
  return request({
    url: proxyPrefix +'/user/update',
    method: 'post',
    data: params
  })
}
