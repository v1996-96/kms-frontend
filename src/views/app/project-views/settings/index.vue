<template src="./template.html"></template>
<script>
import { mapState } from 'vuex'
import TextFiltersMixin from '@/mixins/filters/text'
import ProjectInfoTab from './project-info'
import DocumentsTab from './documents'
import TeamTab from './team'
import TemplatesTab from './templates'
import AdvancedTab from './advanced'

export default {
  name: 'kms-app-project-settings-page',
  mixins: [TextFiltersMixin],
  components: {
    'kms-project-info-tab': ProjectInfoTab,
    'kms-documents-tab': DocumentsTab,
    'kms-team-tab': TeamTab,
    'kms-templates-tab': TemplatesTab,
    'kms-advanced-tab': AdvancedTab
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
