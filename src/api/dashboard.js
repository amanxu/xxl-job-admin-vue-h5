import request from '@/utils/request'
import {proxyPrefix} from '../utils/index'

export function getChartInfo(params) {
  return request({
    url: proxyPrefix + '/chartInfo',
    method: 'get',
    params: params
  })
}
