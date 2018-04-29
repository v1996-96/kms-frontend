<template src="./template.html"></template>
<script>
import { STATE, GETTERS, MUTATIONS, ACTIONS, DEFAULT_ACTIVITY_LIMIT } from './config'

export default {
  name: 'kms-app-dashboard-page',
  computed: {
    ...STATE,
    ...GETTERS,
    activityActionTypeClass () {
      return this.darkTheme ? [] : ['blue--text', 'text--darken-3']
    }
  },
  methods: {
    ...MUTATIONS,
    ...ACTIONS
  },

  created () {
    this.activitySetLimit(DEFAULT_ACTIVITY_LIMIT)
    this.activityLoad()
  }
}
</script>
