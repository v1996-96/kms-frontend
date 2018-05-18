<template>
  <v-card>
    <v-card-title class="pt-2">
      <v-text-field hide-details prepend-icon="search" class="mb-3" clearable label="Type search request here..." v-model="searchQuery"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn color="primary" class="mr-0" @click="showCreateModal = true">Create role</v-btn>
    </v-card-title>

    <v-data-table
      search=""
      :headers="ROLES_TABLE_HEADERS"
      :items="rolesResults"
      :loading="rolesLoading"
      :pagination.sync="pagination"
      :total-items="rolesCount"
      :rows-per-page-items="rowsPerPageItems"
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>
          <v-edit-dialog lazy v-if="!props.item.system">
            <span v-if="props.item.name !== ''">{{ props.item.name }}</span>
            <span v-else>Click here to enter role name</span>
            <v-text-field
              slot="input"
              v-model="props.item.name"
              @blur="updateRole(props.item)"
              label="Role"
              single-line
              autofocus></v-text-field>
          </v-edit-dialog>
          <span v-else>{{ props.item.name }}</span>
        </td>
        <td>
          <v-btn flat small color="primary" v-if="!props.item.system" @click="setRoleEditing(props.item.role_id)">Edit</v-btn>
          <v-btn flat small color="info" v-if="props.item.system" @click="setRoleEditing(props.item.role_id)">Info</v-btn>
          <v-btn v-if="!props.item.system" flat small color="error" @click="showDeleteRole(props.item)">
            Delete
          </v-btn>
        </td>
      </template>
    </v-data-table>

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

    <kms-role-edit v-model="showEditingModal" :role-id="eiditingRoleId" @updated="rolesSearchHandler"></kms-role-edit>
    <kms-role-create v-model="showCreateModal" @created="rolesSearchHandler"></kms-role-create>
  </v-card>
</template>
<script>
import _ from 'lodash'
import Api from '@/api'
import Vue from 'vue'
import SearchPaginateMixin from '@/mixins/search-paginate'
import TextFiltersMixin from '@/mixins/filters/text'
import DateFiltersMixin from '@/mixins/filters/date'
import RoleListModel from '@/models/role/list'
import { ROLES_TABLE_HEADERS } from './config'
import { required } from 'vuelidate/lib/validators'

import RoleEditModal from './role-edit'
import RoleCreateModal from './role-create'

export default {
  name: 'kms-role-settings-roles-tab',
  mixins: [
    SearchPaginateMixin({
      namespace: 'roles',
      endpoint: Api.settings.getRolesList,
      model: RoleListModel,
      onError: (info) => Vue.notify.error('Error occured loading roles: ' + info.toString())
    }),
    TextFiltersMixin,
    DateFiltersMixin
  ],
  components: {
    'kms-role-edit': RoleEditModal,
    'kms-role-create': RoleCreateModal
  },
  data: () => ({
    ROLES_TABLE_HEADERS,
    showDeletionPrompt: false,
    deletingRole: null,
    creationDialog: null,
    isRoleDeleting: false,
    isRoleCreating: false,
    searchQuery: '',
    rowsPerPageItems: [5, 10, 30, 50, 100],
    pagination: { rowsPerPage: 50 },

    showCreateModal: false,
    showEditingModal: false,
    eiditingRoleId: null
  }),

  computed: {
    roleNameErrors () {
      const errors = []
      if (!this.$v.roleName.$dirty) return errors
      !this.$v.roleName.required && errors.push('You must enter role name')
      return errors
    }
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

  validations: {
    roleName: { required }
  },

  methods: {
    rolesSearchHandler: _.debounce(function (page = null, direction = null) {
      return this.rolesSearch({
        page,
        direction,
        filters: {
          query: this.searchQuery
        }
      })
    }, 300),

    updateRole (role) {
      Api.settings.updateRole({
        id: role.role_id,
        model: role
      }).catch(info => {
        this.$notify.error('Error occured while updating role: ' + info.toString())
      })
    },

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
      Api.settings.removeRole({
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
    },

    setRoleEditing (roleId) {
      this.showEditingModal = true
      this.eiditingRoleId = roleId
    }
  },

  created () {
    this.rolesSearchHandler()
  }
}
</script>
