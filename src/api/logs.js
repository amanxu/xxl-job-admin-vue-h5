import request from '@/utils/request'

export function getLogsList(params) {
  return request({
    url: '/joblog/pageList',
    method: 'post',
    params: params
  })
}

export function stopJob(id) {
  return request({
    url: '/joblog/logKill',
    method: 'get',
    params: {id: id}
  })
}

export function getJobDetail(id) {
  return request({
    url: '/joblog/logDetailPage',
    method: 'get',
    params: {id: id}
  })
}


