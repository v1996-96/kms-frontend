import _ from 'lodash'
import Api from '@/api'
import ProjectModel from '@/models/project'
import immutable from 'object-path-immutable'

const createState = () => ({
  isProjectLoading: false,
  isProjectSaving: false,

  project: null,
  projectCache: null
})

const getters = {
  projectEdited (state) {
    return !_.isEqual(state.projectCache, state.project)
  }
}

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
  },

  saveChanges (context) {
    context.commit('setProjectSaving', true)
    return Api.projects.update({
      id: context.state.projectCache.project_id,
      model: context.state.projectCache
    }).then((response) => {
      context.commit('setProjectSaving', false)
      var data = (new ProjectModel(response.data)).toJSON()
      context.commit('setProject', data)
      return data
    }).catch(info => {
      context.commit('setProjectSaving', false)
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
  },
  setProjectSaving (state, value) {
    state.isProjectSaving = value
  },

  updateProjectCache (state, { field, value }) {
    state.projectCache = immutable.set(state.projectCache, field, value)
  },
  discardChanges (state) {
    state.projectCache = JSON.parse(JSON.stringify(state.project))
  }
}

export default {
  namespaced: true,
  state: createState,
  getters,
  actions,
  mutations
}
