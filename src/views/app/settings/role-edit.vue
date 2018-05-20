<template>
  <v-dialog :value="value" @input="setModalState" max-width="600">
    <v-card>
      <v-card-title class="headline">Role view</v-card-title>

      <div v-if="isRoleFetching || isRoleUpdating" class="text-xs-center">
        <v-progress-circular indeterminate :size="50" color="primary"></v-progress-circular>
      </div>

      <v-card-text v-if="!isRoleFetching && !isRoleUpdating && role" class="text-xs-center">
        <v-text-field
          :disabled="roleCache.system || !hasPermission('update_role')"
          v-model="roleCache.name"
          :error-messages="nameErrors"
          @input="$v.roleCache.name.$touch()"
          @blur="$v.roleCache.name.$touch()"
          counter="$v.roleCache.name.$params.maxLength.max"
          label="Name"></v-text-field>

        <kms-permissions
          v-model="roleCache.permissions"
          :error-messages="permissionsErrors"
          @input="$v.roleCache.permissions.$touch()"
          @blur="$v.roleCache.permissions.$touch()"
          :disabled="roleCache.system || !hasPermission('update_role')"></kms-permissions>
      </v-card-text>

      <v-card-actions v-if="role">
        <v-btn flat @click.native="setModalState(false)">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" depressed @click="saveChanges" :loading="isRoleUpdating" :disabled="isRoleUpdating || roleCache.system || !roleChanged || $v.$error || !hasPermission('update_role')">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import _ from 'lodash'
import Api from '@/api'
import RoleModel from '@/models/role'
import PermissionsList from '@/components/active/permissions-list'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'kms-role-edit',
  props: {
    'value': Boolean,
    'roleId': [Number, String]
  },
  components: {
    'kms-permissions': PermissionsList
  },
  data: () => ({
    isRoleFetching: false,
    isRoleUpdating: false,

    role: null,
    roleCache: null
  }),
  computed: {
    roleChanged () {
      return !_.isEqual(this.role, this.roleCache)
    },

    nameErrors () {
      const errors = []
      if (!this.$v.roleCache.name.$dirty) return errors
      !this.$v.roleCache.name.required && errors.push('You must select project name')
      !this.$v.roleCache.name.maxLength && errors.push('Name is too long')
      return errors
    },
    permissionsErrors () {
      const errors = []
      if (!this.$v.roleCache.permissions.$dirty) return errors
      !this.$v.roleCache.permissions.required && errors.push('You must select project permissions')
      return errors
    }
  },

  watch: {
    'roleId': 'fetch'
  },

  validations () {
    return this.roleCache ? {
      roleCache: {
        name: { required, maxLength: maxLength(100) },
        permissions: { required }
      }
    } : {}
  },

  methods: {
    setModalState (value) {
      this.$emit('input', value)
    },

    fetch () {
      if (!this.roleId) {
        return
      }

      this.isRoleFetching = true
      Api.settings.getRole({ id: this.roleId }).then((response) => {
        this.isRoleFetching = false
        this.role = (new RoleModel(response.data)).toJSON()
        this.roleCache = JSON.parse(JSON.stringify(this.role))
      }).catch(info => {
        this.isRoleFetching = false
        this.$notify.error('Error fetching role: ' + info.toString())
      })
    },

    saveChanges () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }

      this.isRoleUpdating = true
      Api.settings.updateRole({
        id: this.role.role_id,
        model: this.roleCache
      }).then(response => {
        this.isRoleUpdating = false
        this.role = (new RoleModel(response.data)).toJSON()
        this.roleCache = JSON.parse(JSON.stringify(this.role))
        this.$emit('updated')
      }).catch(info => {
        this.isRoleUpdating = false
        this.$notify.error('Error updating role: ' + info.toString())
      })
    }
  },

  created () {
    this.fetch()
  }
}
</script>
