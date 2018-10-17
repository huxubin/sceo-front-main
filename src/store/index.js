import Vuex from 'vuex'
import Vue from 'vue'
import * as projectStore from './project-store'
import dictStore from './modules/dict-store'
import userInfoStore from './modules/userInfo-store'
import i18nStore from './modules/i18n-store'
import themeStore from './modules/theme-store'

Vue.use(Vuex)

// 强制使用命名空间
for (let key in projectStore) {
  projectStore[key].namespaced = true
}

const _opt = {
  modules: {
    ...projectStore,
    dictStore,
    userInfoStore,
    i18nStore,
    themeStore
  },
  // 严格模式
  strict: process.env.NODE_ENV === 'development'
}

export default new Vuex.Store(_opt)
