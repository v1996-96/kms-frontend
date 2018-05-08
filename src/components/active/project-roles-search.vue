<template>
  <v-select
    dense
    cache-items
    autocomplete
    item-text="name"
    item-value="project_role_id"
    return-object
    :clearable="clearable"
    label="Roles"
    :multiple="multiple"
    :loading="rolesLoading"
    :items="rolesResults"
    :search-input.sync="query"
    :value="value"
    :required="required"
    :error-messages="errorMessages"
    @blur="onBlur"
    @input="valueChanged"></v-select>
</template>
<script>
import Api from '@/api'
import Vue from 'vue'
import SearchLimitMixin from '@/mixins/search-limit'
import ProjectRoleListModel from '@/models/project-role/list'

export default {
  name: 'kms-roles-search',
  mixins: [
    SearchLimitMixin({
      namespace: 'roles',
      model: ProjectRoleListModel,
      endpoint: Api.projects.getRolesList,
      onError: info => Vue.notify.error('Error occured while loading roles: ' + info.toString())
    })
  ],
  props: {
    'value': [Object, Array],
    'required': Boolean,
    'errorMessages': Array,
    'multiple': {
      type: Boolean,
      default: false
    },
    'clearable': {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    query: ''
  }),

  methods: {
    valueChanged (value) {
      this.$emit('input', value)
    },
    onBlur () {
      this.$emit('blur')
    }
  },
  watch: {
    query (query) {
      this.rolesSearch({ query })
    }
  },
  created () {
    this.rolesSearch()
  }
}
</script>
