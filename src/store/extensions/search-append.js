import _ from 'lodash'

const DEFAULT_LIMIT = 30

const createState = () => ({
  loading: false,
  loaded: false,
  filters: {},
  offset: 0,
  limit: DEFAULT_LIMIT,
  count: 0,
  results: []
})

export default ({
  endpoint,
  options = {},
  model
}) => ({
  namespaced: true,
  state: createState,

  getters: {
    displayingCount (state) {
      return state.results.length
    },
    notFound (state) {
      return !state.loading && state.loaded && state.count === 0
    },
    canLoadMore (state) {
      return state.loaded && state.results.length < state.count
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
    setOffset (state, value) {
      state.offset = value
    },
    setLimit (state, value) {
      state.limit = value
    },
    setCount (state, value) {
      state.count = value
    },
    setResults (state, list) {
      state.results = list
    },
    appendResults (state, list) {
      state.results = _.concat(state.results, list)
    }
  },

  actions: {
    search (context, { filters = {}, append = false } = {}) {
      context.commit('setFilters', filters)

      if (append) {
        var newOffset = context.state.offset + context.state.results.length
        context.commit('setOffset', newOffset <= context.state.count ? newOffset : context.state.count)
      } else {
        context.commit('setOffset', 0)
      }

      var query = _.assign({}, options, context.state.filters, {
        limit: context.state.limit,
        offset: context.state.offset
      })

      context.commit('setLoading', true)

      return endpoint(query).then((response) => {
        var data = new model(response.data) // eslint-disable-line new-cap
        context.commit('setLoaded', true)
        context.commit('setLoading', false)

        var parsedData = data.toJSON()
        context.commit(append ? 'appendResults' : 'setResults', parsedData.results)
        context.commit('setCount', parsedData.count)
        return data
      }).catch((info) => {
        context.commit('setLoading', false)
        return info
      })
    },

    loadMore (context) {
      return context.dispatch('search', {
        filters: context.state.filters,
        append: true
      })
    }
  }
})
