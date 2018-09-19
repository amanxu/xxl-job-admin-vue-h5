import request from '@/utils/request'

export function getList(params) {
  return request({
    baseURL: 'https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin',
    url: '/table/list',
    method: 'get',
    data: params
  })
}
