import request from '@/utils/request'

export function login(account, pwd) {
  const data = {
    username: account,
    password: pwd,
  }
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  const data = {
    token: token
  }
  return request({
    url: '/user/tokenUserInfo',
    method: 'post',
    data
  })
}

export function logout(token) {
  return request({
    url: '/logout',
    method: 'post'
  })
}
