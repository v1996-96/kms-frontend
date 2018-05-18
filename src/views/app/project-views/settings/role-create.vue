<template>
  <v-dialog :value="value" @input="visibilityChanged" max-width="500">
    <v-card>
      <v-card-title class="headline">Add new project role</v-card-title>
      <v-card-text>
        <v-text-field label="Name"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat="flat" @click="visibilityChanged(false)">Cancel</v-btn>
        <v-btn flat="flat" color="primary" @click="add" :disabled="isRoleCreating" :loading="isRoleCreating">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import Api from '@/api'
// import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'kms-project-settings-team-create',
  props: {
    'value': Boolean,
    'projectId': [Number, String]
  },
  data: () => ({
    isRoleCreating: false
  }),

  watch: {
    value (value) {
      if (value) {
        this.clearFields()
      }
    }
  },

  methods: {
    visibilityChanged (value) {
      this.$emit('input', value)
    },
    clearFields () {
      this.$v.$reset()
    },

    add () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }

      this.isRoleCreating = true
      return Api.projects.addTeamRole({
        id: this.projectId,
        model: {
        }
      }).then((response) => {
        this.isRoleCreating = false
        this.visibilityChanged(false)
        this.$emit('created')
      }).catch(info => {
        this.isRoleCreating = false
        this.$notify.error('Error occured while adding team member: ' + info.toString())
      })
    }
  }
}
</script>
