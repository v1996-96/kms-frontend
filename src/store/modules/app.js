const createState = () => ({
  navigationShowing: true
})

const getters = {}

const actions = {}

const mutations = {
  setNavigationShowing (state, value) {
    state.navigationShowing = !!value
  },
  toggleNavigationShowing (state) {
    state.navigationShowing = !state.navigationShowing
  }
}

export default {
  namespaced: true,
  state: createState,
  getters,
  actions,
  mutations
}