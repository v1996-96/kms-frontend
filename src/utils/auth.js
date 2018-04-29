import _ from 'lodash'

export const REFRESH_OFFSET = 120 // seconds

export const IS_ROUTE_WHITELISTED = (route) => _.has(route.meta, 'whitelisted') && route.meta.whitelisted === true

export const ROUTER_MIDDLEWARE = (to, from, next, store) => {
  if (IS_ROUTE_WHITELISTED(to) || store.getters['Account/authorized']) {
    next()
  } else {
    next({ name: 'Signin' })
  }
}
