import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.less' // global css

import App from './App'
import store from '../store'
import router from './router'

// import '@/icons' // icon
import { setPermission } from '@/permission' // permission control
setPermission(router)

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#phone',
  router,
  store,
  render: h => h(App)
})
