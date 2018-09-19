import request from '@/utils/request'
import {proxyPrefix} from '../utils/index'

export function getLogsList(params) {
  return request({
    url: proxyPrefix + '/joblog/pageList',
    method: 'post',
    params: params
  })
}

export function stopJob(id) {
  return request({
    url: proxyPrefix + '/joblog/logKill',
    method: 'get',
    params: {id: id}
  })
}

export function getJobDetail(id) {
  return request({
    url: proxyPrefix + '/joblog/logDetailPage',
    method: 'get',
    params: {id: id}
  })
}

export function clearLogs(params) {
  return request({
    url: proxyPrefix + '/joblog/clearLog',
    method: 'get',
    params: params
  })
}


