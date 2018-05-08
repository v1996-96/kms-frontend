<template src="./template.html"></template>
<script>
import TextFiltersMixin from '@/mixins/filters/text'
import { STATE, GETTERS, MUTATIONS, ACTIONS } from './config'
import ProjectTeamTab from './team-tab'
import ActivityCard from './activity'
import FollowBtn from './follow'

export default {
  name: 'kms-app-project-intro-page',
  mixins: [TextFiltersMixin],
  components: {
    'kms-project-team-tab': ProjectTeamTab,
    'kms-project-activity': ActivityCard,
    'kms-project-follow': FollowBtn
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
  }
}
</script>
