import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { ROUTER_MIDDLEWARE } from '@/utils/auth'

Vue.config.productionTip = false
Vue.use(Vuetify)

// Auth router middleware
router.beforeEach((to, from, next) => ROUTER_MIDDLEWARE(to, from, next, store))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
