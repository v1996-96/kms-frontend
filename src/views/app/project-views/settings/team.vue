<template>
  <v-card>
    <v-card-title class="pt-2">
      <v-text-field hide-details prepend-icon="search" class="mb-3" clearable label="Type search request here..." v-model="searchQuery"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn class="primary mr-0" depressed>Add member</v-btn>
    </v-card-title>

    <v-data-table
      search=""
      :headers="TEAM_TABLE_HEADERS"
      :items="teamResults"
      :loading="teamLoading"
      :pagination.sync="pagination"
      :total-items="teamCount"
      :rows-per-page-items="rowsPerPageItems"
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>
          <v-avatar class="mr-2" size="35" :color="props.item.avatar ? '' : 'grey'">
            <img v-if="props.item.avatar" :src="props.item.avatar" />
            <span v-else class="white--text headline">{{ props.item.name | firstLetterFilter }}</span>
          </v-avatar>
          {{ props.item.name }} {{ props.item.surname }}
        </td>
        <td>{{ props.item.email }}</td>
        <td>{{ props.item.position }}</td>
        <td>{{ props.item.project_role.name }}</td>
        <td>
          <v-btn icon ripple>
            <v-icon color="primary lighten-1">edit</v-icon>
          </v-btn>
          <v-btn icon ripple>
            <v-icon color="red lighten-1">delete</v-icon>
          </v-btn>
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
import TextFiltersMixin from '@/mixins/filters/text'
import ProjectTeamListModel from '@/models/project-team/list'
import { TEAM_TABLE_HEADERS } from './config'

export default {
  name: 'kms-project-settings-team-tab',
  props: {
    'projectId': [Number, String]
  },
  mixins: [
    SearchPaginateMixin({
      namespace: 'team',
      endpoint: Api.projects.getTeam,
      model: ProjectTeamListModel,
      onError: (info) => Vue.notify.error('Error occured loading team: ' + info.toString())
    }),
    TextFiltersMixin
  ],
  data: () => ({
    TEAM_TABLE_HEADERS,
    searchQuery: '',
    rowsPerPageItems: [5, 10, 30, 50, 100],
    pagination: { rowsPerPage: 50 }
  }),

  watch: {
    searchQuery () {
      this.teamSearchHandler()
    },
    pagination (value, oldValue) {
      if (value.rowsPerPage !== oldValue.rowsPerPage) {
        this.teamLimit = value.rowsPerPage
      }

      this.teamSearchHandler(value.page)
    }
  },

  methods: {
    teamSearchHandler: _.debounce(function (page = null, direction = null) {
      return this.teamSearch({
        page,
        direction,
        filters: {
          id: this.projectId,
          query: this.searchQuery
        }
      })
    }, 300)
  },

  created () {
    this.teamSearchHandler()
  }
}
</script>
