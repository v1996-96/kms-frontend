<template>
  <v-card>
    <v-card-title class="pt-0 pb-0">
      Total {{ projectTeamCount }} members
      <v-spacer></v-spacer>
      <v-text-field
        v-model="projectTeamQuery"
        append-icon="search"
        label="Search"
        single-line
        hide-details></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="TEAM_TABLE_HEADERS"
      :items="projectTeamResults"
      :loading="projectTeamLoading"
      :pagination.sync="pagination"
      :total-items="projectTeamCount"
      :rows-per-page-items="rowsPerPageItems"
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }} {{ props.item.surname }}</td>
        <td>{{ props.item.email }}</td>
        <td>
          <v-btn color="primary" flat small>View profile</v-btn>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import _ from 'lodash'
import Api from '@/api'
import Vue from 'vue'
import SearchPaginateMixin from '@/mixins/search-paginate'
import ProjectTeamListModel from '@/models/project-team/list'
import TextFilters from '@/mixins/filters/text'
import DateFilters from '@/mixins/filters/date'
import { TEAM_TABLE_HEADERS } from './config'

export default {
  name: 'kms-project-team-tab',
  props: {
    'projectId': [String, Number]
  },
  mixins: [
    SearchPaginateMixin({
      namespace: 'projectTeam',
      endpoint: Api.projects.getTeam,
      model: ProjectTeamListModel,
      onError: (info) => Vue.notify.error('Error occured loading projectTeam: ' + info.toString())
    }),
    TextFilters,
    DateFilters
  ],
  data: () => ({
    isBookmarkRemoving: false,
    projectTeamQuery: '',
    rowsPerPageItems: [5, 10, 30, 50, 100],
    pagination: { rowsPerPage: 50 },
    TEAM_TABLE_HEADERS
  }),

  computed: {
    showPlaceholder () {
      return ((!this.projectTeamLoaded && !this.projectTeamLoading) || (this.projectTeamLoaded && this.projectTeamNotFound)) && this.projectTeamQuery === ''
    },
    showNothingFound () {
      return this.projectTeamLoaded && this.projectTeamNotFound && this.projectTeamQuery !== ''
    }
  },

  watch: {
    projectId () {
      this.projectTeamSearchHandler()
    },
    projectTeamQuery (value) {
      this.projectTeamSearchHandler()
    },
    pagination (value, oldValue) {
      if (value.rowsPerPage !== oldValue.rowsPerPage) {
        this.projectTeamLimit = value.rowsPerPage
      }

      this.projectTeamSearchHandler(value.page)
    }
  },

  methods: {
    projectTeamSearchHandler: _.debounce(function (page = null, direction = null) {
      if (!this.projectId) {
        return
      }

      return this.projectTeamSearch({
        page,
        direction,
        filters: {
          id: this.projectId,
          query: this.projectTeamQuery
        }
      })
    }, 300)
  },

  created () {
    this.projectTeamSearchHandler()
  }
}
</script>
