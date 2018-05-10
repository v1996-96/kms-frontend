<template>
  <v-card>
    <v-card-title class="pt-2">
      <v-text-field hide-details prepend-icon="search" class="mb-3" clearable label="Type search request here..." v-model="searchQuery"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn color="primary" class="mr-0" :to="{ name: 'Template-create' }">Create template</v-btn>
    </v-card-title>

    <v-data-table
      search=""
      :headers="TEMPLATES_TABLE_HEADERS"
      :items="templatesResults"
      :loading="templatesLoading"
      :pagination.sync="pagination"
      :total-items="templatesCount"
      :rows-per-page-items="rowsPerPageItems"
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>
          <h3>{{ props.item.title }}</h3>
          {{ props.item.description }}
        </td>
        <td>
          <v-btn fab flat icon small color="info" :to="{ name: 'Template-edit', params: { templateslug: props.item.slug } }">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn fab flat icon small color="error" @click="showDeleteTemplate(props.item)" v-if="!props.item.system">
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>

    <v-dialog v-model="showDeletionPrompt" max-width="310">
      <v-card>
        <v-card-title class="headline">Delete template?</v-card-title>
        <v-card-text v-if="deletingTemplate" class="text-xs-center">
          {{ deletingTemplate.title }} <br>
          {{ deletingTemplate.description }}
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click.native="showDeletionPrompt = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" depressed @click="deleteTemplate" :loading="isTemplateDeleting" :disabled="isTemplateDeleting">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import _ from 'lodash'
import Api from '@/api'
import Vue from 'vue'
import SearchPaginateMixin from '@/mixins/search-paginate'
import TextFiltersMixin from '@/mixins/filters/text'
import TemplateListModel from '@/models/template/list'
import { TEMPLATES_TABLE_HEADERS } from './config'

export default {
  name: 'kms-project-settings-templates-tab',
  props: {
    'projectId': [Number, String]
  },
  mixins: [
    SearchPaginateMixin({
      namespace: 'templates',
      endpoint: Api.templates.getList,
      model: TemplateListModel,
      onError: (info) => Vue.notify.error('Error occured loading templates: ' + info.toString())
    }),
    TextFiltersMixin
  ],
  data: () => ({
    TEMPLATES_TABLE_HEADERS,
    showDeletionPrompt: false,
    deletingTemplate: null,
    isTemplateDeleting: false,
    searchQuery: '',
    rowsPerPageItems: [5, 10, 30, 50, 100],
    pagination: { rowsPerPage: 50 }
  }),

  watch: {
    searchQuery () {
      this.templatesSearchHandler()
    },
    pagination (value, oldValue) {
      if (value.rowsPerPage !== oldValue.rowsPerPage) {
        this.templatesLimit = value.rowsPerPage
      }

      this.templatesSearchHandler(value.page)
    }
  },

  methods: {
    parentTemplate (template) {
      return { text: template.parent_template_title, value: template.parent_template_id }
    },
    updateParentTemplate (row, template) {
      row.parent_template_title = template.title
      row.parent_template_id = template.template_id
    },
    saveParentTemplate (template) {
      Api.templates.update({
        id: template.template_id,
        model: template
      }).catch(info => {
        this.$notify.error('Error occured while updating template info: ' + info.toString())
      })
    },

    templatesSearchHandler: _.debounce(function (page = null, direction = null) {
      return this.templatesSearch({
        page,
        direction,
        filters: {
          project: this.projectId,
          query: this.searchQuery
        }
      })
    }, 300),

    cancelDeleteTemplate () {
      this.showDeletionPrompt = false
      this.deletingTemplate = null
    },
    showDeleteTemplate (user) {
      this.deletingTemplate = user
      this.showDeletionPrompt = true
    },
    deleteTemplate () {
      this.isTemplateDeleting = true
      Api.templates.remove({
        id: this.deletingTemplate.template_id
      }).then(() => {
        this.isTemplateDeleting = false
        this.deletingTemplate = null
        this.showDeletionPrompt = false
        this.templatesSearchHandler()
      }).catch(info => {
        this.isTemplateDeleting = false
        this.$notify.error('Error occured while deleting template: ' + info.toString())
      })
    }
  },

  created () {
    this.templatesSearchHandler()
  }
}
</script>
