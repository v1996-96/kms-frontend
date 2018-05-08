<template>
  <v-card>
    <v-card-title class="pt-2">
      <v-text-field hide-details prepend-icon="search" class="mb-3" clearable label="Type search request here..." v-model="searchQuery"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn class="primary mr-0" depressed @click.native.stop="isTeamCreateModalOpened = true">Add member</v-btn>
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
        <td>
          <v-edit-dialog lazy>
            <span v-if="props.item.position !== ''">{{ props.item.position }}</span>
            <span v-else>Click here to enter position</span>
            <v-text-field
              slot="input"
              v-model="props.item.position"
              @blur="updateTeammate(props.item)"
              label="Position"
              single-line
              autofocus></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog lazy>
            <span v-if="props.item.project_role">{{ props.item.project_role.name }}</span>
            <span v-else>Click here to select role</span>
            <kms-roles-search slot="input" :clearable="false" @blur="updateTeammate(props.item)" v-model="props.item.project_role"></kms-roles-search>
          </v-edit-dialog>
        </td>
        <td>
          <v-btn flat small color="error" @click="showDeleteTeammate(props.item)">
            delete
          </v-btn>
        </td>
      </template>
    </v-data-table>

    <kms-team-create :project-id="projectId" v-model="isTeamCreateModalOpened" @created="teamSearchHandler"></kms-team-create>

    <v-dialog v-model="showDeletionPrompt" max-width="310">
      <v-card>
        <v-card-title class="headline">Delete user from project?</v-card-title>
        <v-card-text v-if="deletingUser" class="text-xs-center">
          <v-avatar class="mr-2" size="35" :color="deletingUser.avatar ? '' : 'grey'">
            <img v-if="deletingUser.avatar" :src="deletingUser.avatar" />
            <span v-else class="white--text headline">{{ deletingUser.name | firstLetterFilter }}</span>
          </v-avatar>
          {{ deletingUser.name }} {{ deletingUser.surname }}
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click.native="showDeletionPrompt = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" depressed @click="deleteTeammate" :loading="isTeammateDeleting" :disabled="isTeammateDeleting">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import _ from 'lodash'
import Api from '@/api'
import Vue from 'vue'
import ProjectRolesSearch from '@/components/active/project-roles-search'
import SearchPaginateMixin from '@/mixins/search-paginate'
import TextFiltersMixin from '@/mixins/filters/text'
import ProjectTeamListModel from '@/models/project-team/list'
import { TEAM_TABLE_HEADERS } from './config'
import TeamCreateModal from './team-create'

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
  components: {
    'kms-team-create': TeamCreateModal,
    'kms-roles-search': ProjectRolesSearch
  },
  data: () => ({
    TEAM_TABLE_HEADERS,
    showDeletionPrompt: false,
    deletingUser: null,
    isTeammateDeleting: false,
    isTeamCreateModalOpened: false,
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
    }, 300),

    cancelDeleteTeammate () {
      this.showDeletionPrompt = false
      this.deletingUser = null
    },
    showDeleteTeammate (user) {
      this.deletingUser = user
      this.showDeletionPrompt = true
    },
    deleteTeammate () {
      this.isTeammateDeleting = true
      Api.projects.removeTeamMember({
        id: this.projectId,
        userId: this.deletingUser.user_id
      }).then(() => {
        this.isTeammateDeleting = false
        this.deletingUser = null
        this.showDeletionPrompt = false
        this.teamSearchHandler()
      }).catch(info => {
        this.isTeammateDeleting = false
        this.$notify.error('Error occured while deleting user from project: ' + info.toString())
      })
    },
    updateTeammate (user) {
      Api.projects.updateTeamMember({
        id: this.projectId,
        userId: user.user_id,
        model: user
      }).catch(info => {
        this.$notify.error('Error occured while updating teammate info: ' + info.toString())
      })
    }
  },

  created () {
    this.teamSearchHandler()
  }
}
</script>
