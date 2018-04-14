const createState = () => ({
  navigationShowing: true,
  darkTheme: false
})

const getters = {}

const actions = {}

const mutations = {
  setNavigationShowing (state, value) {
    state.navigationShowing = !!value
  },
  toggleNavigationShowing (state) {
    state.navigationShowing = !state.navigationShowing
  },
  setDarkTheme (state, value) {
    state.darkTheme = !!value
  },
  toggleDarkTheme (state) {
    console.log('toggled')
    state.darkTheme = !state.darkTheme
  }
}

export default {
  namespaced: true,
  state: createState,
  getters,
  actions,
  mutations
}
