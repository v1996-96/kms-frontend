import _ from 'lodash'

export const LOAD_DIRECTION = {
  FORWARD: 'forward',
  BACKWARD: 'backward'
}

export const LIMIT_OPTIONS = [20, 50, 100, 200]
export const LIMIT_DEFAULT = 100

const createState = () => ({
  filters: {},
  limit: LIMIT_DEFAULT,
  page: 1,
  count: 0,
  results: [],
  loaded: false
})

export default ({
  endpoint,
  options = {},
  model
}) => ({
  namespaced: true,
  state: createState,
  getters: {
    filters (state) {
      return state.filters
    },
    results (state) {
      return state.results
    },
    total (state) {
      return state.count
    },
    showing (state) {
      return state.results.length
    },
    offset (state) {
      return state.limit * (state.page - 1)
    },
    limit (state) {
      return state.limit
    },
    totalPages (state) {
      return Math.ceil(state.count / state.limit)
    },
    currentPage (state) {
      return state.page
    },
    showingInterval (state, getters) {
      var increment = state.results.length > 0 ? 1 : 0
      return (getters.offset + increment) + '-' + (getters.offset + state.results.length)
    },
    isNotFound (state) {
      return state.loaded && state.count === 0
    },
    forwardLoadingAvailable (state, getters) {
      return state.page < getters.totalPages
    },
    backwardLoadingAvailable (state) {
      return state.page > 1
    }
  },
  mutations: {
    reset (state) {
      var newState = createState()
      state.page = newState.page
      state.count = newState.count
      state.results = newState.results
      state.loaded = newState.loaded
      state.filters = newState.filters
    },
    setFilters (state, filters) {
      state.filters = filters
    },
    resetFilters (state) {
      state.filters = {}
    },
    setCount (state, count) {
      state.count = count
    },
    setLimit (state, limit) {
      state.limit = limit
    },
    setForwardLoading (state) {
      if (state.page < getters.totalPages(state)) {
        state.page = state.page + 1
      }
    },
    setBackwardLoading (state) {
      if (state.page > 1) {
        state.page = state.page - 1
      }
    },
    setPage (state, page) {
      state.page = page
    },
    setResults (state, list) {
      state.results = list
    },
    clearResults (state) {
      state.results = []
    },
    setLoaded (state) {
      state.loaded = true
    }
  },

  actions: {
    async search (context, { filters = {}, direction = null, page = null } = {}) {
      context.commit('clearResults')

      if (!_.isEqual(context.state.filters, filters)) {
        context.commit('reset')
        context.commit('setFilters', filters)
      }

      if (page !== null) {
        context.commit('setPage', page)
      } else if (direction !== null) {
        switch (direction) {
          case LOAD_DIRECTION.FORWARD:
            context.commit('setForwardLoading')
            break

          case LOAD_DIRECTION.BACKWARD:
            context.commit('setBackwardLoading')
            break
        }
      }

      var queryData = _.assign({}, options, context.state.filters, {
        limit: context.state.limit,
        offset: context.getters.offset
      })

      var response = await endpoint(queryData)
      var data = new model(response.data) // eslint-disable-line new-cap
      var parsedData = data.toJSON()

      context.commit('setCount', parsedData.count)
      context.commit('setResults', parsedData.results)
      context.commit('setLoaded')

      if (parsedData.count > 0 && parsedData.results.length === 0 && context.state.page > context.getters.totalPages) {
        parsedData = await context.dispatch('search', {
          filters: context.state.filters,
          page: context.getters.totalPages
        })
      }

      return data
    },
    reloadPage (context) {
      return context.dispatch('search', { filters: context.state.filters })
    }
  }
})
