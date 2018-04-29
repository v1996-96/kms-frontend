import Api from '@/api'
import NotificationsListModel from '@/models/notifications/list'

import AsyncLoop from '@/utils/async-loop'

const DEFAULT_LIMIT = 30
const NOTIFICATIONS_INTERVAL = 15000

const createState = () => ({
  showing: false,

  loaded: false,
  limit: DEFAULT_LIMIT,
  offset: 0,
  count: 0,
  countUnread: 0,
  list: [],

  loopInstance: null
})

const getters = {
  canLoadMore: (state) => state.offset + state.limit < state.count,
  countUnread: (state) => state.countUnread <= 9 ? state.countUnread : '9+',
  found: (state) => state.loaded && state.count > 0
}

const actions = {
  setupAsyncLoop (context) {
    if (context.state.loopInstance !== null) {
      return
    }

    var loop = AsyncLoop({
      fn: () => context.dispatch('getList'),
      delay: NOTIFICATIONS_INTERVAL
    })
    context.commit('setLoop', loop)
  },

  getList (context, loadMore = false) {
    if (loadMore) {
      var newOffset = context.state.offset + context.state.list.length
      context.commit('setOffset', newOffset <= context.state.count ? newOffset : context.state.count)
    } else {
      context.commit('setOffset', 0)
    }

    return Api.notifications.getList({
      limit: context.state.limit,
      offset: context.state.offset
    }).then((response) => {
      var data = new NotificationsListModel(response.data)
      context.commit('setListResults', data.toJSON())
    })
  },

  async markRead (context) {
    await Api.notifications.read()
    await context.dispatch('getList')
  },

  async clear (context) {
    await Api.notifications.clear()
    await context.dispatch('getList')
  }
}

const mutations = {
  setShowing (state, value) {
    state.showing = !!value
  },
  toggleShowing (state) {
    state.showing = !state.showing
  },

  setLimit (state, limit) {
    state.limit = limit
  },
  setOffset (state, offset) {
    state.offset = offset
  },
  setListResults (state, data) {
    state.loaded = true
    state.list = data.results
    state.count = data.count
    state.countUnread = data.count_unread
  },

  setLoop (state, loop) {
    state.loopInstance = loop
  },
  stopLoop (state) {
    if (state.loopInstance) {
      state.loopInstance.stop()
    }
  },
  startLoop (state) {
    if (state.loopInstance) {
      state.loopInstance.start()
    }
  }
}

export default {
  namespaced: true,
  state: createState,
  getters,
  actions,
  mutations
}
