<template src="./template.html"></template>
<script>
import _ from 'lodash'
import Api from '@/api'
import Vue from 'vue'
import DateFiltersMixin from '@/mixins/filters/date'
import TextFiltersMixin from '@/mixins/filters/text'
import SearchPaginateMixin from '@/mixins/search-paginate'
import UserListModel from '@/models/user/list'
import { TABLE_HEADERS } from './config'

export default {
  name: 'kms-app-users-page',
  mixins: [
    SearchPaginateMixin({
      namespace: 'users',
      endpoint: Api.users.getList,
      model: UserListModel,
      onError: (info) => Vue.notify.error('Error occured loading users: ' + info.toString())
    }),
    DateFiltersMixin,
    TextFiltersMixin
  ],
  data: () => ({
    headers: TABLE_HEADERS,
    usersQuery: '',
    rowsPerPageItems: [5, 10, 30, 50, 100],
    pagination: {
      rowsPerPage: 50
    }
  }),

  watch: {
    usersQuery () {
      this.usersSearchHandler()
    },
    pagination (value, oldValue) {
      if (value.rowsPerPage !== oldValue.rowsPerPage) {
        this.usersLimit = value.rowsPerPage
      }

      this.usersSearchHandler(value.page)
    }
  },

  methods: {
    usersSearchHandler: _.debounce(function (page = null, direction = null) {
      return this.usersSearch({
        page,
        direction,
        filters: {
          query: this.usersQuery
        }
      })
    }, 300)
  },

  created () {
    this.usersSearchHandler()
  }
}
</script>
