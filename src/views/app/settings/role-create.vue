<template>
  <v-dialog :value="value" @input="setModalState" max-width="600">
    <v-card>
      <v-card-title class="headline">Create role</v-card-title>

      <div v-if="isRoleCreating" class="text-xs-center">
        <v-progress-circular indeterminate :size="50" color="primary"></v-progress-circular>
      </div>

      <v-card-text v-if="!isRoleCreating && role" class="text-xs-center">
        <v-text-field
          :disabled="role.system"
          v-model="role.name"
          :error-messages="nameErrors"
          @input="$v.role.name.$touch()"
          @blur="$v.role.name.$touch()"
          counter="$v.role.name.$params.maxLength.max"
          label="Name"></v-text-field>

        <kms-permissions
          v-model="role.permissions"
          :error-messages="permissionsErrors"
          @input="$v.role.permissions.$touch()"
          @blur="$v.role.permissions.$touch()"
          :disabled="role.system"></kms-permissions>
      </v-card-text>

      <v-card-actions v-if="role">
        <v-btn flat @click.native="setModalState(false)">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" depressed @click="createRole" :loading="isRoleCreating" :disabled="isRoleCreating || $v.$error">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import Api from '@/api'
import RoleModel from '@/models/role'
import PermissionsList from '@/components/active/permissions-list'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'kms-role-edit',
  props: {
    'value': Boolean
  },
  components: {
    'kms-permissions': PermissionsList
  },
  data: () => ({
    isRoleCreating: false,

    role: {
      name: '',
      system: false,
      permissions: []
    }
  }),
  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.role.name.$dirty) return errors
      !this.$v.role.name.required && errors.push('You must select project name')
      !this.$v.role.name.maxLength && errors.push('Name is too long')
      return errors
    },
    permissionsErrors () {
      const errors = []
      if (!this.$v.role.permissions.$dirty) return errors
      !this.$v.role.permissions.required && errors.push('You must select project permissions')
      return errors
    }
  },

  validations () {
    return this.role ? {
      role: {
        name: { required, maxLength: maxLength(100) },
        permissions: { required }
      }
    } : {}
  },

  methods: {
    setModalState (value) {
      this.$emit('input', value)
    },

    createRole () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }

      this.isRoleCreating = true
      Api.settings.createRole(this.role).then(response => {
        this.isRoleCreating = false
        this.role = (new RoleModel(response.data)).toJSON()
        this.role = JSON.parse(JSON.stringify(this.role))
        this.$emit('created')
      }).catch(info => {
        this.isRoleCreating = false
        this.$notify.error('Error updating role: ' + info.toString())
      })
    }
  }
}
</script>
