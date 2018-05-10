<template src="./template.html"></template>
<script>
import Vue from 'vue'
import Api from '@/api'
import TextFiltersMixin from '@/mixins/filters/text'
import { STATE, GETTERS, MUTATIONS, ACTIONS } from './config'
import ProjectTeamTab from './team-tab'
import ActivityCard from './activity'
import FollowBtn from './follow'
import SearchSingleMixin from '@/mixins/search-single'
import TemplateModel from '@/models/template'

export default {
  name: 'kms-app-project-intro-page',
  mixins: [
    SearchSingleMixin({
      namespace: 'introTemplate',
      model: TemplateModel,
      endpoint: Api.templates.getSingleByType,
      options: { type: 'project_intro' },
      onError: info => Vue.notify.error('Error occured while loading template')
    }),
    TextFiltersMixin
  ],
  components: {
    'kms-project-team-tab': ProjectTeamTab,
    'kms-project-activity': ActivityCard,
    'kms-project-follow': FollowBtn
  },
  data: () => ({
    tabs: null
  }),
  watch: {
    project (value, oldValue) {
      if (!oldValue || value.project_id !== oldValue.project_id) {
        this.introTemplateLoad({ project: value.project_id })
      }
    }
  },
  computed: {
    ...STATE,
    ...GETTERS
  },

  methods: {
    ...ACTIONS,
    ...MUTATIONS
  },
  created () {
    if (this.project) {
      this.introTemplateLoad({ project: this.project.project_id })
    }
  }
}
</script>
