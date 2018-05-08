<template src="./template.html"></template>
<script>
import { mapState } from 'vuex'
import ProjectInfoTab from './project-info'

export default {
  name: 'kms-app-project-settings-page',
  components: {
    'kms-project-info-tab': ProjectInfoTab
  },
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
