import request from '@/utils/request'

export function getChartInfo(params) {
  return request({
    url: '/chartInfo',
    method: 'get',
    params: params
  })
}
