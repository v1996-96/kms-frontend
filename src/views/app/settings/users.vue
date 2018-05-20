<template>
  <v-card>
    <v-card-title class="pt-2">
      <v-text-field hide-details prepend-icon="search" class="mb-3" clearable label="Type search request here..." v-model="searchQuery"></v-text-field>
      <v-spacer></v-spacer>
      <v-dialog v-model="inviteDialog" max-width="290">
        <v-btn slot="activator" color="primary" class="mr-0">Invite</v-btn>
        <v-card>
          <v-card-title class="headline">Invite new user</v-card-title>
          <v-card-text>
            <v-text-field required v-model="inviteEmail" :error-messages="inviteEmailErrors" @input="$v.inviteEmail.$touch()" @blur="$v.inviteEmail.$touch()" label="Email"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click.native="inviteDialog = false">Cancel</v-btn>
            <v-btn color="primary" flat @click="invite" :disabled="isUserInviting || $v.$invalid" :loading="isUserInviting">Invite</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>

    <v-data-table
      search=""
      :headers="USERS_TABLE_HEADERS"
      :items="usersResults"
      :loading="usersLoading"
      :pagination.sync="pagination"
      :total-items="usersCount"
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
            <div v-if="props.item.roles">
              <v-chip small v-for="role in props.item.roles" :key="role.role_id">{{ role.name }}</v-chip>
            </div>
            <span v-else>Click here to enter roles</span>
            <kms-roles-search
              slot="input"
              multiple
              v-model="props.item.roles"
              @input="updateUser(props.item)"></kms-roles-search>
          </v-edit-dialog>
        </td>
        <td>
          <v-btn flat small color="error" @click="showDeleteUser(props.item)">
            Delete
          </v-btn>
        </td>
      </template>
    </v-data-table>

    <v-dialog v-model="showDeletionPrompt" max-width="310">
      <v-card>
        <v-card-title class="headline">Delete user?</v-card-title>
        <v-card-text v-if="deletingUser" class="text-xs-center">
          {{ deletingUser.name }}
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click.native="showDeletionPrompt = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" depressed @click="deleteUser" :loading="isUserDeleting" :disabled="isUserDeleting">Delete</v-btn>
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
import UserListModel from '@/models/user/list'
import { USERS_TABLE_HEADERS } from './config'
import { required, email } from 'vuelidate/lib/validators'
import RolesSearch from '@/components/active/roles-search'

export default {
  name: 'kms-user-settings-users-tab',
  mixins: [
    SearchPaginateMixin({
      namespace: 'users',
      endpoint: Api.users.getList,
      model: UserListModel,
      onError: (info) => Vue.notify.error('Error occured loading users: ' + info.toString())
    }),
    TextFiltersMixin,
    DateFiltersMixin
  ],
  components: {
    'kms-roles-search': RolesSearch
  },
  data: () => ({
    USERS_TABLE_HEADERS,
    showDeletionPrompt: false,
    deletingUser: null,
    inviteDialog: null,
    isUserDeleting: false,
    isUserInviting: false,
    inviteEmail: '',
    searchQuery: '',
    rowsPerPageItems: [5, 10, 30, 50, 100],
    pagination: { rowsPerPage: 50 }
  }),

  computed: {
    inviteEmailErrors () {
      const errors = []
      if (!this.$v.inviteEmail.$dirty) return errors
      !this.$v.inviteEmail.required && errors.push('You must specify email')
      !this.$v.inviteEmail.email && errors.push('Email is not valid')
      return errors
    }
  },

  watch: {
    searchQuery () {
      this.usersSearchHandler()
    },
    pagination (value, oldValue) {
      if (value.rowsPerPage !== oldValue.rowsPerPage) {
        this.usersLimit = value.rowsPerPage
      }

      this.usersSearchHandler(value.page)
    }
  },

  validations: {
    inviteEmail: { required, email }
  },

  methods: {
    usersSearchHandler: _.debounce(function (page = null, direction = null) {
      return this.usersSearch({
        page,
        direction,
        filters: {
          query: this.searchQuery
        }
      })
    }, 300),

    updateUser (user) {
      Api.users.update({
        id: user.user_id,
        model: user
      }).catch(info => {
        this.$notify.error('Error occured while updating user: ' + info.toString())
      })
    },

    invite () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }

      this.isUserInviting = true
      Api.users.invite({ email: this.inviteEmail }).then((response) => {
        this.isUserInviting = false
        this.inviteDialog = false
        this.$notify.success('Invitation was sent to specified email')
      }).catch((info) => {
        this.isUserInviting = false
        this.$notify.error('Error occured while inviting user: ' + info.toString())
      })
    },

    cancelDeleteUser () {
      this.showDeletionPrompt = false
      this.deletingUser = null
    },
    showDeleteUser (user) {
      this.deletingUser = user
      this.showDeletionPrompt = true
    },
    deleteUser () {
      this.isUserDeleting = true
      Api.users.remove({
        id: this.deletingUser.user_id
      }).then(() => {
        this.isUserDeleting = false
        this.deletingUser = null
        this.showDeletionPrompt = false
        this.usersSearchHandler()
      }).catch(info => {
        this.isUserDeleting = false
        this.$notify.error('Error occured while deleting user: ' + info.toString())
      })
    }
  },

  created () {
    this.usersSearchHandler()
  }
}
</script>
