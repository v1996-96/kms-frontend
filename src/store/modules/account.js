import _ from 'lodash'
import Api from '@/api'
import moment from 'moment'
import { REFRESH_OFFSET } from '@/utils/auth'
import AuthModel from '@/models/auth'

const createState = () => ({
  access_token: null,
  refresh_token: null,
  profile: null
})

const getters = {
  jwt: state => state.access_token,
  jwtData: (state, getters) => getters.jwt ? JSON.parse(atob(getters.jwt.split('.')[1])) : null,
  jwtSubject: (state, getters) => getters.jwtData ? getters.jwtData.sub : null,
  jwtIssuer: (state, getters) => getters.jwtData ? getters.jwtData.iss : null,
  jwtExpires: (state, getters) => getters.jwtData ? getters.jwtData.exp : null,

  authorized: (state, getters) => getters.jwtData && moment.utc().unix() < getters.jwtExpires,
  shouldRefresh (state, getters) {
    var diff = moment.unix(getters.jwtExpires).utc().diff(moment.utc(), 's')
    return diff <= REFRESH_OFFSET && diff > 0
  }
}

const actions = {
  signin (context, { email, password }) {
    return Api.auth.signin({ email, password }).then((response) => {
      context.commit('setAuthInfo', new AuthModel(response.data))
      return true
    })
  },

  logout (context) {
    return Api.auth.revoke({ token: context.state.refresh_token }).then((reponse) => {
      context.commit('reset')
      return true
    })
  },

  refresh (context) {
    return Api.auth.refresh({ token: context.state.refresh_token }).then((response) => {
      context.commit('setAuthInfo', new AuthModel(response.data))
      return true
    })
  },

  getProfile (context) {
    return true
  }
}

const mutations = {
  reset (state) {
    _.assign(state, createState())
  },
  setAuthInfo (state, auth) {
    state.access_token = auth.access_token
    state.refresh_token = auth.refresh_token
  }
}

export default {
  namespaced: true,
  state: createState,
  getters,
  actions,
  mutations
}
