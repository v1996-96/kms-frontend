<template>
  <v-select
    dense
    cache-items
    autocomplete
    item-text="name"
    item-value="template_type_slug"
    return-object
    :clearable="clearable"
    label="Template type"
    :multiple="multiple"
    :loading="typesLoading"
    :items="typesResults"
    :search-input.sync="query"
    :value="value"
    :required="required"
    :error-messages="errorMessages"
    :disabled="disabled"
    :hide-details="!errorMessages"
    @blur="onBlur"
    @input="valueChanged"></v-select>
</template>
<script>
import Api from '@/api'
import Vue from 'vue'
import SearchLimitMixin from '@/mixins/search-limit'
import TemplateTypeListModel from '@/models/template-type/list'

export default {
  name: 'kms-types-search',
  mixins: [
    SearchLimitMixin({
      namespace: 'types',
      model: TemplateTypeListModel,
      endpoint: Api.templates.getTypes,
      onError: info => Vue.notify.error('Error occured while loading types: ' + info.toString())
    })
  ],
  props: {
    'value': [Object, Array],
    'required': Boolean,
    'errorMessages': Array,
    'projectId': Number,
    'disabled': {
      type: Boolean,
      default: false
    },
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
      this.typesSearch(this.filters)
    }
  },
  created () {
    this.typesSearch(this.filters)
  }
}
</script>
