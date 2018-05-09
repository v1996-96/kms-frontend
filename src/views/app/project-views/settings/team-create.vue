<template>
  <v-dialog :value="value" @input="visibilityChanged" max-width="500">
    <v-card>
      <v-card-title class="headline">Add new team member</v-card-title>
      <v-card-text>
        <kms-users-search
          required
          @input="$v.user.$touch()"
          :error-messages="userErrors"
          v-model="user"></kms-users-search>
        <kms-roles-search
          required
          @input="$v.role.$touch()"
          :error-messages="roleErrors"
          v-model="role"></kms-roles-search>
        <v-text-field
          @input="$v.position.$touch()"
          :error-messages="positionErrors"
          v-model="position"
          label="Position"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat="flat" @click="visibilityChanged(false)">Cancel</v-btn>
        <v-btn flat="flat" color="primary" @click="add" :disabled="isMemberAdding" :loading="isMemberAdding">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import Api from '@/api'
import ProjectRolesSearch from '@/components/active/project-roles-search'
import UsersSearch from '@/components/active/users-search'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'kms-project-settings-team-create',
  props: {
    'value': Boolean,
    'projectId': [Number, String]
  },
  components: {
    'kms-roles-search': ProjectRolesSearch,
    'kms-users-search': UsersSearch
  },
  data: () => ({
    isMemberAdding: false,
    user: null,
    role: null,
    position: ''
  }),
  computed: {
    userErrors () {
      const errors = []
      if (!this.$v.user.$dirty) return errors
      !this.$v.user.required && errors.push('You must select user')
      return errors
    },
    roleErrors () {
      const errors = []
      if (!this.$v.role.$dirty) return errors
      !this.$v.role.required && errors.push('You must select project role')
      return errors
    },
    positionErrors () {
      const errors = []
      if (!this.$v.position.$dirty) return errors
      !this.$v.position.maxLength && errors.push('Position is too long')
      return errors
    }
  },

  watch: {
    value (value) {
      if (value) {
        this.clearFields()
      }
    }
  },

  validations: {
    user: { required },
    role: { required },
    position: { maxLength: maxLength(100) }
  },

  methods: {
    visibilityChanged (value) {
      this.$emit('input', value)
    },
    clearFields () {
      this.$v.$reset()
      this.user = null
      this.role = null
      this.position = ''
    },

    add () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }

      this.isMemberAdding = true
      return Api.projects.addTeamMember({
        id: this.projectId,
        model: {
          user_id: this.user.user_id,
          position: this.position,
          project_role: this.role
        }
      }).then((response) => {
        this.isMemberAdding = false
        this.visibilityChanged(false)
        this.$emit('created')
      }).catch(info => {
        this.isMemberAdding = false
        this.$notify.error('Error occured while adding team member: ' + info.toString())
      })
    }
  }
}
</script>
