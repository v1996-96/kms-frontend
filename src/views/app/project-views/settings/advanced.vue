<template>
  <v-card>
    <v-card-text>
      <h4 class="subheading mb-0">Roles management</h4>

      <v-layout class="pt-2">
        <v-text-field hide-details prepend-icon="search" class="mb-3" clearable label="Type search request here..." v-model="rolesSearchQuery"></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="mr-0" @click="isRoleCreateModalOpened = true">Create role</v-btn>
      </v-layout>
    </v-card-text>

    <v-divider></v-divider>

    <v-data-table
      search=""
      :headers="ROLES_TABLE_HEADERS"
      :items="rolesResults"
      :loading="rolesLoading"
      :pagination.sync="pagination"
      :total-items="rolesCount"
      :rows-per-page-items="rowsPerPageItems"
      class="elevation-0">
      <template slot="items" slot-scope="props">
        <td>
          {{ props.item.name }}
        </td>
        <td>
          <v-btn v-if="!props.item.system" fab flat icon small color="info">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn v-if="!props.item.system" fab flat icon small color="error" @click="showDeleteRole(props.item)">
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>

    <v-divider></v-divider>

    <v-card-text>

      <p class="error--text mb-0">
        While deleting project, you will delete all assigned roles. You will not be able to rollback. <br>

        <v-dialog v-model="deletionDialog" max-width="400">
          <v-btn slot="activator" color="error" class="ml-0">Delete project</v-btn>
          <v-card>
            <v-card-title class="headline">Are you sure?</v-card-title>
            <v-card-text>
              <p>
                You will not be able to restore deleted project. <br>
                In order to completely delete project enter project name in the field below: <code>{{ project.name }}</code>
              </p>

              <v-text-field v-model="deletionProjectName" solo label="Project name"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn flat @click="cancelDeletion">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="error" v-if="!deletionAgreed" @click="deletionAgreed = true">Agree</v-btn>
              <v-btn color="error" v-if="deletionAgreed" @click="deleteProject" :disabled="isProjectDeleting" :loading="isProjectDeleting">Delete project</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </p>
    </v-card-text>

    <v-dialog v-model="showDeletionPrompt" max-width="310">
      <v-card>
        <v-card-title class="headline">Delete role?</v-card-title>
        <v-card-text v-if="deletingRole" class="text-xs-center">
          {{ deletingRole.name }}
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click.native="showDeletionPrompt = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" depressed @click="deleteRole" :loading="isRoleDeleting" :disabled="isRoleDeleting">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <kms-role-create v-if="project" :projectId="project.project_id" v-model="isRoleCreateModalOpened"></kms-role-create>
  </v-card>
</template>
<script>
import _ from 'lodash'
import Api from '@/api'
import Vue from 'vue'
import SearchPaginateMixin from '@/mixins/search-paginate'
import TextFiltersMixin from '@/mixins/filters/text'
import RoleListModel from '@/models/project-role/list'
import { createNamespacedHelpers } from 'vuex'
import { ROLES_TABLE_HEADERS } from './config'
import RoleCreateModal from './role-create'

const { mapState, mapActions } = createNamespacedHelpers('ProjectSingle')

export default {
  name: 'kms-project-settings-advanced-tab',
  mixins: [
    SearchPaginateMixin({
      namespace: 'roles',
      endpoint: Api.projects.getRolesList,
      model: RoleListModel,
      onError: (info) => Vue.notify.error('Error occured loading roles: ' + info.toString())
    }),
    TextFiltersMixin
  ],
  components: {
    'kms-role-create': RoleCreateModal
  },
  data: () => ({
    ROLES_TABLE_HEADERS,

    isRoleCreateModalOpened: false,

    deletionDialog: null,
    deletionProjectName: '',
    deletionAgreed: false,

    rolesSearchQuery: '',
    showDeletionPrompt: false,
    deletingRole: null,
    isRoleDeleting: false,
    rowsPerPageItems: [5, 10, 30, 50, 100],
    pagination: { rowsPerPage: 50 }
  }),
  computed: {
    ...mapState({
      'project': s => s.project,
      'isProjectDeleting': s => s.isProjectDeleting
    })
  },

  watch: {
    searchQuery () {
      this.rolesSearchHandler()
    },
    pagination (value, oldValue) {
      if (value.rowsPerPage !== oldValue.rowsPerPage) {
        this.rolesLimit = value.rowsPerPage
      }

      this.rolesSearchHandler(value.page)
    }
  },

  methods: {
    ...mapActions({
      'deleteProjectAction': 'deleteProject'
    }),

    cancelDeletion () {
      this.deletionDialog = false
      this.deletionAgreed = false
      this.deletionProjectName = ''
    },

    deleteProject () {
      this.deleteProjectAction().then(() => {
        this.cancelDeletion()
        this.$router.push({ name: 'Projects' })
      }).catch(info => {
        this.$notify.error('Error occured while deleting project')
        this.deletionAgreed = false
        this.deletionProjectName = ''
      })
    },

    rolesSearchHandler: _.debounce(function (page = null, direction = null) {
      return this.rolesSearch({
        page,
        direction,
        filters: {
          project: this.project.project_id,
          query: this.rolesSearchQuery
        }
      })
    }, 300),

    cancelDeleteRole () {
      this.showDeletionPrompt = false
      this.deletingRole = null
    },
    showDeleteRole (user) {
      this.deletingRole = user
      this.showDeletionPrompt = true
    },
    deleteRole () {
      this.isRoleDeleting = true
      Api.roles.remove({
        id: this.deletingRole.role_id
      }).then(() => {
        this.isRoleDeleting = false
        this.deletingRole = null
        this.showDeletionPrompt = false
        this.rolesSearchHandler()
      }).catch(info => {
        this.isRoleDeleting = false
        this.$notify.error('Error occured while deleting role: ' + info.toString())
      })
    }
  }
}
</script>
