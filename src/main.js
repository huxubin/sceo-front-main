import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import utils from './utils'
import i18n from './utils/i18n'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets

// 引入生成后的icon样式
import './assets/icon-fonts/icon.css'

// 加载拦截器
import './config/interceptor.js'

Vue.config.productionTip = false
Vue.prototype.UTILS = utils

// 事件池
Vue.prototype.$eventBus = new Vue()

// 页面刷新初始化登录用户信息
store.dispatch('userInfoStore/init').then(() => {
  loadVue()
})

function loadVue () {
  new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount('#app')
}
