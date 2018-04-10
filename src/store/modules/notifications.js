const createState = () => ({
  showing: false
})

const getters = {}

const actions = {}

const mutations = {
  setShowing (state, value) {
    state.showing = !!value
  },
  toggleShowing (state) {
    state.showing = !state.showing
  }
}

export default {
  namespaced: true,
  state: createState,
  getters,
  actions,
  mutations
}
