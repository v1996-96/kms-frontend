import _ from 'lodash'
import Api from '@/api'
import moment from 'moment'
import { REFRESH_OFFSET } from '@/utils/auth'
import AuthModel from '@/models/auth'
import ProfileModel from '@/models/profile'
import InviteModel from '@/models/invite'

const createState = () => ({
  access_token: null,
  refresh_token: null,
  profile: null,

  invitation: null
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
  },
  profileLoaded: (state) => state.profile !== null,
  canSignUp: (state) => state.invitation !== null
}

const actions = {
  async signin (context, { email, password }) {
    await Api.auth.signin({ email, password }).then((response) => {
      context.commit('setAuthInfo', new AuthModel(response.data))
    })

    await context.dispatch('getProfile')

    return true
  },

  async signup (context, { name, surname, password, invitetoken }) {
    await Api.auth.signup({ token: invitetoken, model: { name, surname, password } }).then(response => {
      context.commit('setAuthInfo', new AuthModel(response.data))
    })

    await context.dispatch('getProfile')

    return true
  },

  checkInvite (context, token) {
    return Api.auth.checkInvite({ token }).then((response) => {
      var data = (new InviteModel(response.data)).toJSON()
      context.commit('setInvitation', data)
      return data
    })
  },

  logout (context) {
    if (!context.state.refresh_token) {
      return
    }

    return Api.auth.revoke({ token: context.state.refresh_token }).then((reponse) => {
      context.commit('reset')
      return true
    }).catch(info => {
      context.commit('reset')
      return info
    })
  },

  refresh (context) {
    return Api.auth.refresh({ token: context.state.refresh_token }).then((response) => {
      context.commit('setAuthInfo', new AuthModel(response.data))
      return true
    })
  },

  getProfile (context) {
    return Api.profile.get().then((response) => {
      context.commit('setProfile', new ProfileModel(response.data))
      return true
    })
  }
}

const mutations = {
  reset (state) {
    _.assign(state, createState())
    Api.removeJWT()
  },
  syncAccessToken (state) {
    if (state.access_token === null) {
      Api.removeJWT()
    } else {
      Api.setJWT(state.access_token)
    }
  },
  setAuthInfo (state, auth) {
    state.access_token = auth.access_token
    state.refresh_token = auth.refresh_token
    Api.setJWT(auth.access_token)
  },
  setProfile (state, profile) {
    state.profile = profile
  },
  setInvitation (state, data) {
    state.invitation = data
  }
}

export default {
  namespaced: true,
  state: createState,
  getters,
  actions,
  mutations
}
