import axios from 'axios'
import utils from '../../utils'

const Base64 = require('js-base64').Base64

const state = {
  jwt: null,
  jwtExp: 0,
  userId: null,
  userInfo: { currentStatus: {} },
  user: null
}

const getters = {
  getUser () {
    return state.user
  },
  getCurrentDept () {
    return state.userInfo.currentStatus.depttreeEntity || {}
  },
  getCurrentPost () {
    return state.userInfo.currentStatus.currentPosition || {}
  },
  getCurrentUser () {
    return state.userInfo.currentStatus.currentStaff || {}
  },
  logout (state) {
    return state.user === null
  }
}

const mutations = {
  setJwt (state, jwt) {
    state.jwt = jwt
  },
  setJwtExp (state, jwtExp) {
    state.jwtExp = jwtExp
  },
  setUserId (state, userId) {
    state.userId = userId
  },
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo || { currentStatus: {} }
  },
  setUser (state, user) {
    state.user = user
  }
}
const actions = {
  init ({ commit, dispatch }) {
    let JWT = window.sessionStorage.getItem('JWT')
    let userId = null
    let exp = 0
    if (JWT) {
      axios.defaults.headers.common['Authorization'] = JWT
      let jwts = JWT.split('.')
      let tmp = Base64.decode(jwts[1])
      if (tmp) {
        tmp = JSON.parse(tmp)
        exp = tmp.exp
        userId = tmp.sub.id
      }
    }
    commit('setJwt', JWT)
    commit('setJwtExp', exp)
    commit('setUserId', userId)
    return dispatch('loadUser')
  },
  loadUser ({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      if (state.jwt === null) {
        commit('setUser', null)
        commit('setUserInfo', null)
        return resolve('none')
      }
      utils.execUtil('people', 'queryPeopleInfo', null)
        .then(data => {
          let users = data.peopleEntity
          users.certificateType = 1
          users.epeo_addr_text = ''
          commit('setUser', users)
          resolve(users)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  logout ({ commit }, router) {
    utils.execUtil('people', 'loginOut', null)
      .then(data => {
        window.sessionStorage.removeItem('JWT')
        this.dispatch('userInfoStore/init')
        router.push('/login')
      })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
