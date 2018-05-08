import _ from 'lodash'
import Api from '@/api'
import ProjectModel from '@/models/project'

const createState = () => ({
  isProjectLoading: false,
  project: null,
  projectCache: null,
  team: []
})

const getters = {}

const actions = {
  fetch (context, idOrSlug) {
    context.commit('setProjectLoading', true)

    return Api.projects.getSingle({ id: idOrSlug }).then((response) => {
      context.commit('setProjectLoading', false)
      var data = (new ProjectModel(response.data)).toJSON()
      context.commit('setProject', data)
      return data
    }).catch(info => {
      context.commit('setProjectLoading', false)
      return info
    })
  }
}

const mutations = {
  reset (state) {
    _.assign(state, createState())
  },
  setProject (state, project) {
    state.project = project
    state.projectCache = JSON.parse(JSON.stringify(project))
  },
  setProjectLoading (state, value) {
    state.isProjectLoading = value
  }
}

export default {
  namespaced: true,
  state: createState,
  getters,
  actions,
  mutations
}
