import request from '@/utils/request'

export function getJobPageList(params) {
  return request({
    url: '/jobinfo/pageList',
    method: 'get',
    params: params
  })
}

export function getJobsByGroup(groupId) {
  return request({
    url: '/jobinfo/jobsByGroup',
    method: 'get',
    params: {groupId: groupId}
  })
}

export function create(params) {
  return request({
    url: '/jobinfo/add',
    method: 'post',
    data: params
  })
}

export function remove(id) {
  return request({
    url: '/jobinfo/remove',
    method: 'get',
    params: {id: id}
  })
}

export function update(params) {
  return request({
    url: '/jobinfo/update',
    method: 'post',
    data: params
  })
}

export function jobTrigger(id) {
  return request({
    url: '/jobinfo/trigger',
    method: 'get',
    params: {id: id}
  })
}

export function jobResume(id) {
  return request({
    url: '/jobinfo/resume',
    method: 'get',
    params: {id: id}
  })
}

export function jobPause(id) {
  return request({
    url: '/jobinfo/pause',
    method: 'get',
    params: {id: id}
  })
}
