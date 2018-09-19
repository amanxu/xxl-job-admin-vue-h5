import request from '@/utils/request'
import {proxyPrefix} from '../utils/index'

export function getJobPageList(params) {
  return request({
    url: proxyPrefix + '/jobinfo/pageList',
    method: 'get',
    params: params
  })
}

export function getJobsByGroup(groupId) {
  return request({
    url: proxyPrefix + '/jobinfo/jobsByGroup',
    method: 'get',
    params: {groupId: groupId}
  })
}

export function create(params) {
  return request({
    url: proxyPrefix + '/jobinfo/add',
    method: 'post',
    data: params
  })
}

export function remove(id) {
  return request({
    url: proxyPrefix + '/jobinfo/remove',
    method: 'get',
    params: {id: id}
  })
}

export function update(params) {
  return request({
    url: proxyPrefix + '/jobinfo/update',
    method: 'post',
    data: params
  })
}

export function jobTrigger(id) {
  return request({
    url: proxyPrefix + '/jobinfo/trigger',
    method: 'get',
    params: {id: id}
  })
}

export function jobResume(id) {
  return request({
    url: proxyPrefix + '/jobinfo/resume',
    method: 'get',
    params: {id: id}
  })
}

export function jobPause(id) {
  return request({
    url: proxyPrefix + '/jobinfo/pause',
    method: 'get',
    params: {id: id}
  })
}
