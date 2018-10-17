import utils from '@/utils'
import Vue from 'vue'

const getLabel = function (data, id) {
  if (data && data.length > 0) {
    for (let index = 0; index < data.length; index++) {
      const item = data[index]
      if (item.id === id) {
        return item.name
      }
    }
  }
  return null
}
const findProvinceById = function (provinces, id) {
  if (!provinces) {
    return null
  }
  for (let index = 0; index < provinces.length; index++) {
    const item = provinces[index]
    if (item.id === id) {
      return item
    }
  }
  return null
}

const state = {
  // 所有数据字典
  dicts: {},
  // 所有树形数据字典
  trees: {},
  provinces: null
}

const getters = {
  provinces: state => state.provinces
}

const mutations = {
  addDictToCache (state, { data }) {
    for (let index in data) {
      Vue.set(state.dicts, index, data[index])
    }
  },
  addDictTreeToCache (state, { code, data }) {
    Vue.set(state.trees, code, data)
  },
  getProvinces (state, { data }) {
    Vue.set(state, 'provinces', data)
  },
  getCityByProvince (state, { data, province }) {
    Vue.set(province, 'children', data)
  },
  setObjChildren (state, { obj, data }) {
    Vue.set(obj, 'children', data)
  },
  delObjChildren (state, obj) {
    Vue.delete(obj, 'children')
  }
}

const actions = {
  getEnumByCodes ({ state, commit }, codes) {
    return new Promise((resolve, reject) => {
      let codesToGet = []
      let result = {}
      for (let index = 0; index < codes.length; index++) {
        if (!state.dicts[codes[index]]) {
          codesToGet.push(codes[index])
        } else {
          result[codes[index]] = state.dicts[codes[index]]
        }
      }
      // 没有新的数据字典需要获取
      if (!codesToGet.length) {
        resolve(result)
      } else {
        utils.execUtil('wordlist', 'getEnumObjects', {
          enumCodes: codesToGet.join(',')
        }).then(data => {
          commit('addDictToCache', { data })
          for (let index in data) {
            result[index] = data[index]
          }
          resolve(result)
        }).catch(err => {
          reject(err)
        })
      }
    })
  },
  // 查找省
  getProvinces ({ state, commit }) {
    return new Promise((resolve, reject) => {
      if (state.provinces) {
        resolve(state.provinces)
      } else {
        utils.execUtil('area', 'getChinaProvinces', {}).then(data => {
          for (let i = 0; i < data.length; i++) {
            Vue.set(data[i], 'children', [])
          }
          commit('getProvinces', { data })
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      }
    })
  },
  // 查找市
  getCityByProvince ({ state, commit }, { provinceId }) {
    return new Promise((resolve, reject) => {
      const province = findProvinceById(state.provinces, provinceId)
      if (!province) {
        resolve([])
      } else if (province.children && province.children.length > 0) {
        // 直接从缓存中获取
        resolve(province.children)
      } else {
        // 从服务端获取
        utils.execUtil('area', 'getAreasByPid', {
          pid: provinceId
        }).then(data => {
          // for (let i = 0; i < data.length; i++) {
          //   Vue.set(data[i], 'children', [])
          // }
          commit('getCityByProvince', { data, province })
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      }
    })
  },
  // 查找子集
  getChildDeep ({ state, commit }, obj) {
    return new Promise((resolve, reject) => {
      if (obj.children && obj.children.length > 0) {
        return resolve(obj.children)
      }
      // 从服务端获取
      utils.execUtil('area', 'getAreasByPid', {
        pid: obj.id
      }).then(data => {
        // for (let i = 0; i < data.length; i++) {
        //   Vue.set(data[i], 'children', [])
        // }
        if (data && data.length < 1) {
          commit('delObjChildren', obj)
        } else {
          commit('setObjChildren', { obj, data })
        }
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /**
   * 获取省市区字符串数组
   * @param state
   * @param commit
   * @param dispatch
   * @param arr
   * @returns {Promise<any>}
   */
  showText ({ state, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      let rs = []
      if (!data.epeo_addrp) return resolve(rs)
      dispatch('getProvinces').then(provinces => {
        let p = findProvinceById(provinces, data.epeo_addrp)
        rs.push(p.name)
        if (!data.epeo_addrc) return resolve(rs)
        dispatch('getChildDeep', p).then(citys => {
          let c = findProvinceById(citys, data.epeo_addrc)
          rs.push(c.name)
          if (!data.epeo_addrl) return resolve(rs)
          dispatch('getChildDeep', c).then(areas => {
            let a = findProvinceById(areas, data.epeo_addrl)
            rs.push(a.name)
            resolve(rs)
          })
        })
      })
    })
  },
  /**
   * 获取省字符
   * @param state
   * @param commit
   * @param dispatch
   * @param provinceId
   * @returns {*}
   */
  showProvince ({ state, commit, dispatch }, provinceId) {
    return new Promise((resolve, reject) => {
      if (!state.provinces) {
        dispatch('getProvinces', { state, commit }).then(() => {
          resolve(getLabel(state.provinces, provinceId))
        })
      } else {
        resolve(getLabel(state.provinces, provinceId))
      }
    })
  },
  /**
   * 获取市字符
   * @param state
   * @param commit
   * @param dispatch
   * @param provinceId
   * @param cityId
   * @returns {*}
   */
  showCity ({ state, commit, dispatch }, { provinceId, cityId }) {
    return new Promise((resolve, reject) => {
      const province = findProvinceById(state.provinces, provinceId)
      if (!province) {
        resolve()
        return
      }
      if (province.children && province.children.length > 0) {
        resolve(getLabel(province.children, cityId))
      } else {
        dispatch('getCityByProvince', { provinceId }).then(() => {
          resolve(getLabel(province.children, cityId))
        })
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
