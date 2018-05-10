import _ from 'lodash'
import Api from '@/api'
import SearchResultsModel from '@/models/search/list'
import SearchPaginate from '@/store/extensions/search-paginate'

export const DEBOUNCE_TIME = 300
export const DEBOUNCE_OPTIONS = { maxWait: 3000 }

const createState = () => ({
  query: '',
  isSearchingAdvanced: false
})

const getters = {}

const actions = {
  run: _.debounce(function (context, page = null) {
    context.dispatch('Engine/search', {
      page,
      filters: {
        query: context.state.query
      }
    })
  }, DEBOUNCE_TIME, DEBOUNCE_OPTIONS)
}

const mutations = {
  setQuery (state, query) {
    state.query = query
  },
  setAdvansedSearching (state, value) {
    console.log('Advanced', value)
    state.isSearchingAdvanced = value
  }
}

var Engine = SearchPaginate({
  endpoint: Api.search.run,
  model: SearchResultsModel
})

export default {
  namespaced: true,
  state: createState,
  getters,
  actions,
  mutations,
  modules: {
    Engine
  }
}
