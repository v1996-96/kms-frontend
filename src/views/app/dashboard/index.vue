<template src="./template.html"></template>
<script>
import Api from '@/api'
import Vue from 'vue'
import DateFilters from '@/mixins/filters/date'
import SearchSingleMixin from '@/mixins/search-single'
import TemplateModel from '@/models/template'
import { STATE, GETTERS, MUTATIONS, ACTIONS, DEFAULT_ACTIVITY_LIMIT } from './config'

export default {
  name: 'kms-app-dashboard-page',
  mixins: [
    DateFilters,
    SearchSingleMixin({
      namespace: 'introTemplate',
      model: TemplateModel,
      endpoint: Api.templates.getSingleByType,
      options: { type: 'system_intro' },
      onError: info => Vue.notify.error('Error occured while loading template')
    })
  ],
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
    this.introTemplateLoad()
  }
}
</script>
