import _ from 'lodash'
import Api from '@/api'
import DocumentModel from '@/models/document'
import DocumentListModel from '@/models/document/list'
import SearchAppendExtension from '@/store/extensions/search-append'

const createState = () => ({
  isDocumentLoading: false,
  areChildrenLoading: false,

  document: null
})

const getters = {}

const actions = {
  async fetch (context, { idOrSlug, projectId }) {
    if (!idOrSlug) {
      context.commit('setDocument', null)
      return
    }

    context.commit('setDocumentLoading', true)
    var data = await Api.documents.getSingle({ id: idOrSlug }).then((response) => {
      context.commit('setDocumentLoading', false)
      var data = (new DocumentModel(response.data)).toJSON()
      context.commit('setDocument', data)
      return data
    }).catch(info => {
      context.commit('setDocumentLoading', false)
      return info
    })

    await context.dispatch('loadChildren', projectId)

    return data
  },

  loadChildren (context, projectId) {
    return context.dispatch('Children/search', {
      filters: context.state.document === null
        ? { project: projectId, root: true }
        : { project: projectId, children: context.state.document.document_id }
    })
  }
}

const mutations = {
  reset (state) {
    _.assign(state, createState())
  },
  setDocumentLoading (state, value) {
    state.isDocumentLoading = value
  },
  setChildrenLoading (state, value) {
    state.areChildrenLoading = value
  },

  setDocument (state, value) {
    state.document = value
  }
}

var Children = SearchAppendExtension({
  endpoint: Api.documents.getList,
  model: DocumentListModel
})

export default {
  namespaced: true,
  state: createState,
  getters,
  actions,
  mutations,
  modules: {
    Children
  }
}
