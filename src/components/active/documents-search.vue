<template>
  <v-select
    dense
    cache-items
    autocomplete
    item-text="title"
    item-value="document_id"
    return-object
    clearable
    label="Documents"
    :multiple="multiple"
    :loading="documentsLoading"
    :items="documentsResults"
    :search-input.sync="query"
    :value="value"
    :required="required"
    :error-messages="errorMessages"
    @blur="onBlur"
    @input="valueChanged">
      <template slot="selection" slot-scope="scope">
        {{ scope.item.title }}
      </template>
      <template slot="item" slot-scope="scope">
        {{ scope.item.title }}
      </template>
    </v-select>
</template>
<script>
import Api from '@/api'
import Vue from 'vue'
import SearchLimitMixin from '@/mixins/search-limit'
import DocumentListModel from '@/models/document/list'

export default {
  name: 'kms-documents-search',
  mixins: [
    SearchLimitMixin({
      namespace: 'documents',
      model: DocumentListModel,
      endpoint: Api.documents.getList,
      onError: info => Vue.notify.error('Error occured while loading documents: ' + info.toString())
    })
  ],
  props: {
    'projectId': [Number, String],
    'value': [Object, Array],
    'required': Boolean,
    'errorMessages': Array,
    'multiple': {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    query: ''
  }),

  computed: {
    filters () {
      var filters = {}

      if (this.projectId) {
        filters.project = this.projectId
      }

      if (this.query !== '') {
        filters.query = this.query
      }

      return filters
    }
  },

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
      this.documentsSearch(this.filters)
    }
  },
  created () {
    this.documentsSearch(this.filters)
  }
}
</script>
