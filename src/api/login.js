import request from '@/utils/request'
import {proxyPrefix} from '../utils/index'

export function login(account, pwd) {
  const data = {
    username: account,
    password: pwd,
  }
  return request({
    url: proxyPrefix + '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  const data = {
    token: token
  }
  return request({
    url: proxyPrefix + '/user/tokenUserInfo',
    method: 'post',
    data
  })
}

export function logout(token) {
  return request({
    url: proxyPrefix + '/logout',
    method: 'post'
  })
}
