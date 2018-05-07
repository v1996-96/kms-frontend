import Api from '@/api'
import SearchAppend from '@/store/extensions/search-append'
import SearchSingle from '@/store/extensions/search-single'
import TemplateModel from '@/models/template'

const createState = () => ({
})

const getters = {}

const actions = {}

const mutations = {}

const IntroTemplate = SearchSingle({
  endpoint: Api.templates.getSingleByType,
  model: TemplateModel,
  options: { type: 'a1' }
})

export default {
  namespaced: true,
  state: createState,
  getters,
  actions,
  mutations,
  modules: {
    IntroTemplate
  }
}
