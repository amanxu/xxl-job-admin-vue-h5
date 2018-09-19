import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import {Message} from 'element-ui'
import {getToken} from '@/utils/auth' // 验权

const whiteList = ['/login', '/'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({path: '/'})
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
      return
    }
    if (store.getters.name === null || store.getters.name === '' || store.getters.name.length === 0) { // 判断当前用户是否已拉取完user_info信息
      store.dispatch('GetInfo').then(res => { // 拉取用户信息
        const roles = res.content.roles // note: roles must be a array! such as: ['editor','develop']
        store.dispatch('GenerateRoutes', {roles}).then(() => { // 根据roles权限生成可访问的路由表
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          next({...to, replace: true}) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        })
        return
      }).catch((err) => {
        store.dispatch('FedLogOut').then(() => {
          Message.error(err || 'Verification failed, please login again')
          next({path: '/'})
        })
      })
    }
    next()
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress/
})
