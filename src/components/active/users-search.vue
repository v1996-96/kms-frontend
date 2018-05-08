<template>
  <v-select
    dense
    cache-items
    autocomplete
    item-text="name"
    item-value="user_id"
    return-object
    clearable
    label="Users"
    :multiple="multiple"
    :loading="usersLoading"
    :items="usersResults"
    :search-input.sync="query"
    :value="value"
    @input="valueChanged">
      <template slot="selection" slot-scope="scope">
        {{ scope.item.name }} {{ scope.item.surname }}
      </template>
      <template slot="item" slot-scope="scope">
        {{ scope.item.name }} {{ scope.item.surname }}
      </template>
    </v-select>
</template>
<script>
import Api from '@/api'
import Vue from 'vue'
import SearchLimitMixin from '@/mixins/search-limit'
import UserListModel from '@/models/user/list'

export default {
  name: 'kms-users-search',
  mixins: [
    SearchLimitMixin({
      namespace: 'users',
      model: UserListModel,
      endpoint: Api.users.getList,
      onError: info => Vue.notify.error('Error occured while loading users: ' + info.toString())
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
      this.usersSearch({ query })
    }
  },
  created () {
    this.usersSearch()
  }
}
</script>
