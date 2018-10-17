import Vue from 'vue'
import Router from 'vue-router'
import * as projectRouter from './project-router'
import store from '../store'
import utils from '../utils'

Vue.use(Router)

let projectRouterList = []

for (let index in projectRouter) {
  projectRouterList.push(projectRouter[index])
}

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/id/mine'
    },
    ...projectRouterList
  ]
})

const except = [
  'Login'
]

router.beforeEach((to, from, next) => {
  if (except.includes(to.name)) {
    next()
  } else { // from.name判断是否链接
    utils.updateSessionStorageCrossTab(from.name).then((data) => {
      if (data) {
        next()
      } else {
        if (store.getters['userInfoStore/logout'] && except.indexOf(to.name) === -1) {
          next('/login')
        } else {
          next()
        }
      }
    })
  }
})
export default router
