import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters, mapMutations, mapState } = createNamespacedHelpers('DocumentSingle')

export const STATE = mapState({
  'document': s => s.document
})

export const GETTERS = mapGetters({
})

export const MUTATIONS = mapMutations({
})

export const ACTIONS = mapActions({
  'fetchAction': 'fetch',
  'markSeenAction': 'markSeen'
})
