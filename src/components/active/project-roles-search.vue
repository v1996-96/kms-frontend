<template>
  <v-select
    dense
    cache-items
    autocomplete
    item-text="name"
    item-value="project_role_id"
    return-object
    clearable
    label="Roles"
    :multiple="multiple"
    :loading="rolesLoading"
    :items="rolesResults"
    :search-input.sync="query"
    :value="value"
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
    'multiple': {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    query: ''
  }),

  methods: {
    valueChanged (value) {
      this.$emit('input', value)
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
