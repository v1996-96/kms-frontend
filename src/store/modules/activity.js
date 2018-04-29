import Api from '@/api'
import SearchAppend from '@/store/extensions/search-append'
import ActivityListModel from '@/models/activity/list'

const createState = () => ({
})

const getters = {}

const actions = {}

const mutations = {}

const List = SearchAppend({
  endpoint: Api.activity.getList,
  model: ActivityListModel
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
