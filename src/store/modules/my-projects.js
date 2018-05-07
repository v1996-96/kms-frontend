import Api from '@/api'
import SearchAppend from '@/store/extensions/search-append'
import ProjectListModel from '@/models/project/list'

const createState = () => ({
})

const getters = {}

const actions = {}

const mutations = {}

const List = SearchAppend({
  endpoint: Api.projects.getList,
  model: ProjectListModel,
  options: { my: true }
})

export default {
  namespaced: true,
  state: createState,
  getters,
  actions,
  mutations,
  modules: {
    List
  }
}
