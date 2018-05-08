import store from '@/store'

export default (Vue, options) => {
  var notifier = {
    success (text, multiline = false) {
      store.dispatch('Notifier/success', { text, multiline })
    },

    info (text, multiline = false) {
      store.dispatch('Notifier/info', { text, multiline })
    },

    error (text, multiline = false) {
      store.dispatch('Notifier/error', { text, multiline })
    }
  }

  Vue.notify = notifier
  Vue.prototype.$notify = notifier
}
