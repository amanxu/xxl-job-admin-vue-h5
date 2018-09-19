import Vue from 'vue'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control
import moment from 'moment'

Vue.use(ElementUI)

Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if(typeof (dataStr) === 'string') {
    return dataStr
  }
  return moment(dataStr).format(pattern)
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
