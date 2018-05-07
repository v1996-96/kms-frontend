import _ from 'lodash'

const DEFAULT_LIMIT = 30

const createState = () => ({
  loading: false,
  loaded: false,
  filters: {},
  result: null
})

export default ({
  endpoint,
  options = {},
  model
}) => ({
  namespaced: true,
  state: createState,

  getters: {
    notFound (state) {
      return !state.loading && state.loaded && state.result === null
    }
  },

  mutations: {
    reset (state) {
      _.assign(state, createState())
    },

    setLoading (state, value) {
      state.loading = value
    },
    setLoaded (state, value) {
      state.loaded = value
    },
    setFilters (state, filters) {
      state.filters = filters
    },
    clearFilters (state) {
      state.filters = {}
    },
    setResult (state, result) {
      state.result = result
    }
  },

  actions: {
    load (context, { filters = {}, append = false } = {}) {
      context.commit('setFilters', filters)

      var query = _.assign({}, options, context.state.filters)

      context.commit('setLoading', true)

      return endpoint(query).then((response) => {
        var data = new model(response.data) // eslint-disable-line new-cap
        context.commit('setLoaded', true)
        context.commit('setLoading', false)
        context.commit('result', data.toJSON())
        return data
      }).catch((info) => {
        context.commit('setLoading', false)
        return info
      })
    }
  }
})
