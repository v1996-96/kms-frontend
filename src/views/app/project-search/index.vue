<template src="./template.html"></template>
<script>
import _ from 'lodash'
import Api from '@/api'
import Vue from 'vue'
import DateFiltersMixin from '@/mixins/filters/date'
import TextFiltersMixin from '@/mixins/filters/text'
import SearchPaginateMixin from '@/mixins/search-paginate'
import ProjectListModel from '@/models/project/list'
import { TABLE_HEADERS } from './config'

export default {
  name: 'kms-app-settings-page',
  mixins: [
    SearchPaginateMixin({
      namespace: 'projects',
      endpoint: Api.projects.getList,
      model: ProjectListModel,
      onError: (info) => Vue.notify.error('Error occured loading projects: ' + info.toString())
    }),
    DateFiltersMixin,
    TextFiltersMixin
  ],
  data: () => ({
    headers: TABLE_HEADERS,
    projectsQuery: '',
    rowsPerPageItems: [5, 10, 30, 50, 100],
    pagination: {
      rowsPerPage: 50
    }
  }),

  watch: {
    projectsQuery () {
      this.projectsSearchHandler()
    },
    pagination (value, oldValue) {
      if (value.rowsPerPage !== oldValue.rowsPerPage) {
        this.projectsLimit = value.rowsPerPage
      }

      this.projectsSearchHandler(value.page)
    }
  },

  methods: {
    projectsSearchHandler: _.debounce(function (page = null, direction = null) {
      return this.projectsSearch({
        page,
        direction,
        filters: {
          query: this.projectsQuery
        }
      })
    }, 300)
  },

  created () {
    this.projectsSearchHandler()
  }
}
</script>
