const actions = {
  changeTheme ({ state, commit }, newTheme) {
    commit('setTheme', newTheme)
  }
}

const mutations = {
  setTheme (state, theme) {
    state.themeName = theme
  }
}

const state = {
  themeName: 'custom-theme-1'
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
