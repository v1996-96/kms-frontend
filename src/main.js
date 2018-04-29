import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { ROUTER_MIDDLEWARE, SETUP_HTTP_MIDDLEWARE, SETUP_AUTH_CHECKS } from '@/utils/auth'

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
  template: '<App/>',
  created () {
    SETUP_AUTH_CHECKS(store, router)
    SETUP_HTTP_MIDDLEWARE(store, router)
  }
})
