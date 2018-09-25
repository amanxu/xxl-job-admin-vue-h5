import request from '../utils/request'
import {artPrefix} from '../utils/index'

export function fetchPage(query) {
  return request({
    url: artPrefix + '/article/list',
    method: 'post',
    data: query
  })
}

export function detail(id) {
  return request({
    url: artPrefix + '/article/detail',
    method: 'post',
    data: {id: id}
  })
}

export function create(data) {
  return request({
    url: artPrefix + '/article/create',
    method: 'post',
    data: data
  })
}

export function modify(data) {
  return request({
    url: artPrefix + '/article/modify',
    method: 'post',
    data: data
  })
}

export function deleted(id) {
  return request({
    url: artPrefix + '/article/delete',
    method: 'post',
    data: {id: id}
  })
}

export function operate(data) {
  return request({
    url: artPrefix + '/article/operate',
    method: 'post',
    data: data
  })
}

export function userByName(name) {
  return request({
    url: artPrefix + '/user/listByName',
    method: 'get',
    params: {realName: name}
  })
}

