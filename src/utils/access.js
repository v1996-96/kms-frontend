import _ from 'lodash'
import store from '@/store'

export default (Vue, options) => {
  var hasPermission = (permission) => {
    return store && store.state.Account && store.state.Account.profile && store.state.Account.profile.permissions ? _.includes(store.state.Account.profile.permissions, permission) : false
  }

  Vue.mixin({
    methods: { hasPermission }
  })

  Vue.hasPermission = hasPermission
  Vue.prototype.$hasPermission = hasPermission
}
