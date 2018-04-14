<template src="./template.html"></template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'kms-app-my-work-page',
  data: () => ({
    tabs: null
  }),
  computed: {
    ...mapState({
      'darkTheme': s => s.App.darkTheme
    }),
    headingClass () {
      return this.darkTheme ? [] : ['grey', 'lighten-4']
    }
  }
}
</script>
