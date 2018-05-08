<template src="./template.html"></template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'kms-app-project-settings-page',
  data: () => ({
    tabs: null
  }),
  computed: {
    ...mapState({
      'darkTheme': s => s.App.darkTheme,
      'project': s => s.ProjectSingle.project
    })
  }
}
</script>
