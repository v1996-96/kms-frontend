import Vue from 'vue'
import Vuex from 'vuex'

import App from './modules/app'
import Notifications from './modules/notifications'
import Searching from './modules/searching'
import Account from './modules/account'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    App,
    Notifications,
    Searching,
    Account
  }
})
