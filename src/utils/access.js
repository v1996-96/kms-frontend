import _ from 'lodash'
import store from '@/store'

export default (Vue, options) => {
  var hasPermission = (permission) => {
    return store && store.state.Account && store.state.Account.profile && store.state.Account.profile.permissions ? _.includes(store.state.Account.profile.permissions, permission) : false
  }
  var hasProjectPermission = (permission) => {
    return store && store.state.ProjectSingle && store.state.ProjectSingle.project && store.state.ProjectSingle.project.permissions ? _.includes(store.state.ProjectSingle.project.permissions, permission) : false
  }

  Vue.mixin({
    methods: { hasPermission, hasProjectPermission }
  })

  Vue.hasPermission = hasPermission
  Vue.hasProjectPermission = hasProjectPermission
  Vue.prototype.$hasPermission = hasPermission
  Vue.prototype.$hasProjectPermission = hasProjectPermission
}
