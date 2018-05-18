<template src="./template.html"></template>
<script>
import { mapState } from 'vuex'
import ProjectsTab from './projects'
import CompetencesTab from './competences'
import UsersTab from './users'
import TemplatesTab from './templates'
import AccessTab from './access'

export default {
  name: 'kms-app-settings-page',
  components: {
    'kms-projects': ProjectsTab,
    'kms-competences': CompetencesTab,
    'kms-users': UsersTab,
    'kms-templates': TemplatesTab,
    'kms-access': AccessTab
  },
  data: () => ({
    tabs: null
  }),
  computed: {
    ...mapState({
      'darkTheme': s => s.App.darkTheme
    })
  }
}
</script>
