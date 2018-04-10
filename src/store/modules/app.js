const createState = () => ({
  navigation: false
})

const getters = {}

const actions = {}

const mutations = {
  setNavigationCollapsed (state, value) {
    state.navigation = !!value
  },
  toggleNavigationCollapsed (state) {
    state.navigation = !state.navigation
  }
}

export default {
  namespaced: true,
  state: createState,
  getters,
  actions,
  mutations
}
