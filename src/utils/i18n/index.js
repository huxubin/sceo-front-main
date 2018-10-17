import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ElementLocale from 'element-ui/lib/locale'
import I18nMessages from './i18n-messages'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'zh-CN',
  messages: I18nMessages
})
ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n
