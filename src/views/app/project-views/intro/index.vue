<template src="./template.html"></template>
<script>
import TextFiltersMixin from '@/mixins/filters/text'
import { STATE, GETTERS, MUTATIONS, ACTIONS } from './config'
import ProjectTeamTab from './team-tab'

export default {
  name: 'kms-app-project-intro-page',
  mixins: [TextFiltersMixin],
  props: {
    'projectslug': String
  },
  components: {
    'kms-project-team-tab': ProjectTeamTab
  },
  data: () => ({
    tabs: null
  }),
  computed: {
    ...STATE,
    ...GETTERS
  },

  methods: {
    ...ACTIONS,
    ...MUTATIONS
  },

  created () {
    this.fetch(this.projectslug)
  }
}
</script>
