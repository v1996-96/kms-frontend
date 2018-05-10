import _ from 'lodash'
import Api from '@/api'
import UserModel from '@/models/user'
import immutable from 'object-path-immutable'

const createState = () => ({
  isUserLoading: false,

  user: null,
  userCache: null
})

const getters = {
  userEdited (state) {
    return !_.isEqual(state.userCache, state.user)
  }
}

const actions = {
  fetch (context, idOrSlug) {
    context.commit('setUserLoading', true)
    return Api.users.getSingle({ id: idOrSlug }).then((response) => {
      context.commit('setUserLoading', false)
      var data = (new UserModel(response.data)).toJSON()
      context.commit('setUser', data)
      return data
    }).catch(info => {
      context.commit('setUserLoading', false)
      return info
    })
  }
}

const mutations = {
  reset (state) {
    _.assign(state, createState())
  },
  setUser (state, user) {
    state.user = user
    state.userCache = JSON.parse(JSON.stringify(user))
  },
  setUserLoading (state, value) {
    state.isUserLoading = value
  },

  updateUserCache (state, { field, value }) {
    state.userCache = immutable.set(state.userCache, field, value)
  },
  discardChanges (state) {
    state.userCache = JSON.parse(JSON.stringify(state.user))
  }
}

export default {
  namespaced: true,
  state: createState,
  getters,
  actions,
  mutations
}
