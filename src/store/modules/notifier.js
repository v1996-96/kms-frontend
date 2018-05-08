import _ from 'lodash'
import async from 'async'

export const DEFAULT_DISPLAY_TIMEOUT = 2500
export const NOTIFICATIONS_OFFSET = 400

// Notifier worker
// Handles notification showing
var queue = async.queue(function ({ context, type, text, multiline }, next) {
  if (!context) {
    return
  }

  context.commit('setType', type)
  context.commit('setText', text)
  context.commit('setMultiline', multiline)
  context.commit('setTimeout', DEFAULT_DISPLAY_TIMEOUT)
  context.commit('setActive', true)

  _.delay(() => {
    context.commit('setActive', false)
  }, DEFAULT_DISPLAY_TIMEOUT)

  _.delay(next, DEFAULT_DISPLAY_TIMEOUT + NOTIFICATIONS_OFFSET, null)
}, 1)

const createState = () => ({
  type: 'info',
  text: '',
  multiline: false,
  timeout: DEFAULT_DISPLAY_TIMEOUT,
  isActive: false
})

const actions = {
  success (context, { text, multiline }) {
    queue.push({ context, type: 'success', text, multiline })
  },
  info (context, { text, multiline }) {
    queue.push({ context, type: 'info', text, multiline })
  },
  error (context, { text, multiline }) {
    queue.push({ context, type: 'error', text, multiline })
  }
}

const mutations = {
  reset (state) {
    _.assign(state, createState())
  },
  setType (state, type) {
    state.type = type
  },
  setText (state, text) {
    state.text = text
  },
  setMultiline (state, multiline) {
    state.multiline = multiline
  },
  setTimeout (state, timeout) {
    state.timeout = timeout
  },
  setActive (state, value) {
    state.isActive = value
  }
}

export default {
  namespaced: true,
  state: createState,
  actions,
  mutations
}
