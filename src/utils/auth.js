import _ from 'lodash'
import async from 'async'
import { http } from '@/api'

export const REFRESH_OFFSET = 240 // seconds
export const AUTH_CHECK_INTERVAL = 5000 // milliseconds
const REFRESCH_FAILURES_LIMIT = 4
var REFRESH_ATTEMPTS = 0
var REFRESH_PROMISE = null

export const IS_ROUTE_WHITELISTED = (route) => _.has(route.meta, 'whitelisted') && route.meta.whitelisted === true

export const ROUTER_MIDDLEWARE = (to, from, next, store) => {
  if (IS_ROUTE_WHITELISTED(to) || store.getters['Account/authorized']) {
    next()
  } else {
    next({ name: 'Signin' })
  }
}

export const SETUP_HTTP_MIDDLEWARE = (store, router) => {
  http.interceptors.request.use(request => {
    return REFRESH_PROMISE && _.defaultTo(request.intercept, true) ? REFRESH_PROMISE.then(() => request) : request
  })

  http.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status && error.response.status === 401) {
      store.dispatch('Account/logout')
      router.push({ name: 'Signin' })
    } else {
      return Promise.reject(error)
    }
  })
}

export const SETUP_AUTH_CHECKS = (store, router) => async.forever(next => {
  if (IS_ROUTE_WHITELISTED(router.currentRoute)) {
    return _.delay(next, AUTH_CHECK_INTERVAL, null)
  }

  store.commit('Account/syncAccessToken')

  if (!store.getters['Account/authorized']) {
    store.dispatch('Account/logout')
    router.push({ name: 'Signin' })
    return _.delay(next, AUTH_CHECK_INTERVAL, null)
  }

  if (store.getters['Account/shouldRefresh']) {
    REFRESH_PROMISE = store.dispatch('Account/refresh').then((response) => {
      REFRESH_ATTEMPTS = 0
      _.delay(next, AUTH_CHECK_INTERVAL, null)
      return true
    }).catch((info) => {
      if (REFRESH_ATTEMPTS >= REFRESCH_FAILURES_LIMIT) {
        REFRESH_ATTEMPTS = 0
        store.dispatch('Account/logout')
        router.push({ name: 'Signin' })
      } else {
        REFRESH_ATTEMPTS++
      }

      _.delay(next, AUTH_CHECK_INTERVAL, null)
      return true
    })
  } else {
    _.delay(next, AUTH_CHECK_INTERVAL, null)
  }
})
