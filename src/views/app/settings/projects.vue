<template>
  <v-card>
    <v-card-title class="pt-2">
      <v-text-field hide-details prepend-icon="search" class="mb-3" clearable label="Type search request here..." v-model="searchQuery"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn color="primary" class="mr-0" :to="{ name: 'Project-create' }">Create project</v-btn>
    </v-card-title>

    <v-data-table
      search=""
      :headers="PROJECTS_TABLE_HEADERS"
      :items="projectsResults"
      :loading="projectsLoading"
      :pagination.sync="pagination"
      :total-items="projectsCount"
      :rows-per-page-items="rowsPerPageItems"
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <td><router-link :to="{ name: 'Project-intro', params: { projectslug: props.item.slug } }">{{ props.item.name }}</router-link></td>
        <td>{{ props.item.members_count }}</td>
        <td>{{ props.item.date_start | dateFilter }}</td>
        <td>
          <v-chip small text-color="white" :color="props.item.is_active ? 'success' : 'grey'">{{ props.item.is_active ? 'Active' : 'Finished' }}</v-chip>
        </td>
        <td>
          <v-btn fab flat icon small color="info" class="mr-1" :to="{ name: 'Project-intro', params: { projectslug: props.item.slug } }">
            <v-icon>store</v-icon>
          </v-btn>
          <v-btn fab flat icon small color="error" @click="showDeleteProject(props.item)">
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>

    <v-dialog v-model="showDeletionPrompt" max-width="310">
      <v-card>
        <v-card-title class="headline">Delete project?</v-card-title>
        <v-card-text v-if="deletingProject" class="text-xs-center">
          {{ deletingProject.name }}
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click.native="showDeletionPrompt = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" depressed @click="deleteProject" :loading="isProjectDeleting" :disabled="isProjectDeleting">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import _ from 'lodash'
import Api from '@/api'
import Vue from 'vue'
import SearchPaginateMixin from '@/mixins/search-paginate'
import TextFiltersMixin from '@/mixins/filters/text'
import DateFiltersMixin from '@/mixins/filters/date'
import ProjectListModel from '@/models/project/list'
import { PROJECTS_TABLE_HEADERS } from './config'

export default {
  name: 'kms-project-settings-projects-tab',
  mixins: [
    SearchPaginateMixin({
      namespace: 'projects',
      endpoint: Api.projects.getList,
      model: ProjectListModel,
      onError: (info) => Vue.notify.error('Error occured loading projects: ' + info.toString())
    }),
    TextFiltersMixin,
    DateFiltersMixin
  ],
  data: () => ({
    PROJECTS_TABLE_HEADERS,
    showDeletionPrompt: false,
    deletingProject: null,
    isProjectDeleting: false,
    searchQuery: '',
    rowsPerPageItems: [5, 10, 30, 50, 100],
    pagination: { rowsPerPage: 50 }
  }),

  watch: {
    searchQuery () {
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
          query: this.searchQuery
        }
      })
    }, 300),

    cancelDeleteProject () {
      this.showDeletionPrompt = false
      this.deletingProject = null
    },
    showDeleteProject (user) {
      this.deletingProject = user
      this.showDeletionPrompt = true
    },
    deleteProject () {
      this.isProjectDeleting = true
      Api.projects.remove({
        id: this.deletingProject.project_id
      }).then(() => {
        this.isProjectDeleting = false
        this.deletingProject = null
        this.showDeletionPrompt = false
        this.projectsSearchHandler()
      }).catch(info => {
        this.isProjectDeleting = false
        this.$notify.error('Error occured while deleting project: ' + info.toString())
      })
    }
  },

  created () {
    this.projectsSearchHandler()
  }
}
</script>
