import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import createMutationsSharer from 'vuex-shared-mutations'
import * as Cookies from 'js-cookie'

import App from './modules/app'
import Notifications from './modules/notifications'
import Searching from './modules/searching'
import Account from './modules/account'
import Activity from './modules/activity'
import MyProjects from './modules/my-projects'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  plugins: [
    createPersistedState({
      paths: [
        'Account.access_token',
        'Account.refresh_token'
      ],
      getState: (key) => Cookies.getJSON(key),
      setState: (key, state) => Cookies.set(key, state, { expires: 10 })
    }),
    createPersistedState({
      paths: ['App']
    }),
    createMutationsSharer({
      predicate: ['Account/setAuthInfo']
    })
  ],

  modules: {
    App,
    Notifications,
    Searching,
    Account,
    Activity,
    MyProjects
  }
})
