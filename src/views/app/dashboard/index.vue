<template src="./template.html"></template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'kms-app-dashboard-page',
  computed: {
    ...mapState({
      'darkTheme': s => s.App.darkTheme
    }),
    activityActionTypeClass () {
      return this.darkTheme ? [] : ['blue--text', 'text--darken-3']
    }
  }
}
</script>
