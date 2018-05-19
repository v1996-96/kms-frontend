<template>
  <v-select
    dense
    cache-items
    autocomplete
    item-text="name"
    item-value="project_permission_slug"
    return-object
    label="Permissions"
    multiple
    chips
    deletable-chips
    :disabled="disabled"
    :loading="arePermissionsLoading"
    :items="permissions"
    :search-input.sync="query"
    :value="value"
    :required="required"
    :error-messages="errorMessages"
    @blur="onBlur"
    @input="valueChanged"></v-select>
</template>
<script>
import Api from '@/api'
import PermissionListModel from '@/models/project-permission/list'

export default {
  name: 'kms-documents-search',
  props: {
    'value': [Object, Array],
    'required': Boolean,
    'errorMessages': Array,
    'disabled': Boolean
  },
  data: () => ({
    query: '',
    arePermissionsLoading: false,
    permissions: []
  }),

  methods: {
    valueChanged (value) {
      this.$emit('input', value)
    },
    onBlur () {
      this.$emit('blur')
    },

    load () {
      this.arePermissionsLoading = true
      Api.projects.getPermissions().then(reponse => {
        this.arePermissionsLoading = false
        var data = (new PermissionListModel(reponse.data)).toJSON()
        this.permissions = data.permissions
      }).catch(info => {
        this.arePermissionsLoading = false
        this.$notify.error('Error occured while loading permissions: ' + info.toString())
      })
    }
  },

  created () {
    this.load()
  }
}
</script>
