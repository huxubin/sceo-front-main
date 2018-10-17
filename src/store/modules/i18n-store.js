import i18n from '@/utils/i18n'

const actions = {
  changeLocale ({ state, commit }, newLocale) {
    i18n.locale = newLocale
  }
}

export default {
  namespaced: true,
  actions
}
