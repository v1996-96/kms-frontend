import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters, mapMutations, mapState } = createNamespacedHelpers('ProjectSingle')

export const TEAM_TABLE_HEADERS = [
  { text: 'Name', value: 'name', sortable: false },
  { text: 'Email', value: 'email', sortable: false },
  { text: 'Actions', value: 'actions', sortable: false }
]

export const STATE = mapState({
  'project': s => s.project
})

export const GETTERS = mapGetters({
})

export const MUTATIONS = mapMutations({
})

export const ACTIONS = mapActions({
})
