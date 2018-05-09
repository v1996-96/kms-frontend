<template>
  <v-card>
    <v-card-title class="pt-2">
      <v-text-field hide-details prepend-icon="search" class="mb-3" clearable label="Type search request here..." v-model="searchQuery"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn color="primary" class="mr-0" :to="{ name: 'Document-create' }">Create document</v-btn>
    </v-card-title>

    <v-data-table
      search=""
      :headers="DOCUMENTS_TABLE_HEADERS"
      :items="documentsResults"
      :loading="documentsLoading"
      :pagination.sync="pagination"
      :total-items="documentsCount"
      :rows-per-page-items="rowsPerPageItems"
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>
          <h3>{{ props.item.title }}</h3>
          {{ props.item.subtitle }}
        </td>
        <td>
          <v-edit-dialog lazy>
            <span v-if="props.item.parent_document_id">{{ props.item.parent_document_title }}</span>
            <span v-else>Click here to assign parent document</span>
            <kms-documents-search
              slot="input"
              :clearable="false"
              @blur="saveParentDocument(props.item)"
              @input="updateParentDocument(props.item, $event)"
              :value="parentDocument(props.item)"></kms-documents-search>
          </v-edit-dialog>
        </td>
        <td>
          <v-btn fab flat icon small color="info" :to="{ name: 'Document-edit', params: { documentslug: props.item.slug } }">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn fab flat icon small color="error" @click="showDeleteDocument(props.item)">
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>

    <v-dialog v-model="showDeletionPrompt" max-width="310">
      <v-card>
        <v-card-title class="headline">Delete document?</v-card-title>
        <v-card-text v-if="deletingDocument" class="text-xs-center">
          {{ deletingDocument.title }} <br>
          {{ deletingDocument.subtitle }}
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click.native="showDeletionPrompt = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" depressed @click="deleteDocument" :loading="isDocumentDeleting" :disabled="isDocumentDeleting">Delete</v-btn>
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
import DocumentListModel from '@/models/document/list'
import { DOCUMENTS_TABLE_HEADERS } from './config'
import DocumentsSearch from '@/components/active/documents-search'

export default {
  name: 'kms-project-settings-documents-tab',
  props: {
    'projectId': [Number, String]
  },
  mixins: [
    SearchPaginateMixin({
      namespace: 'documents',
      endpoint: Api.documents.getList,
      model: DocumentListModel,
      onError: (info) => Vue.notify.error('Error occured loading documents: ' + info.toString())
    }),
    TextFiltersMixin
  ],
  components: {
    'kms-documents-search': DocumentsSearch
  },
  data: () => ({
    DOCUMENTS_TABLE_HEADERS,
    showDeletionPrompt: false,
    deletingDocument: null,
    isDocumentDeleting: false,
    searchQuery: '',
    rowsPerPageItems: [5, 10, 30, 50, 100],
    pagination: { rowsPerPage: 50 }
  }),

  watch: {
    searchQuery () {
      this.documentsSearchHandler()
    },
    pagination (value, oldValue) {
      if (value.rowsPerPage !== oldValue.rowsPerPage) {
        this.documentsLimit = value.rowsPerPage
      }

      this.documentsSearchHandler(value.page)
    }
  },

  methods: {
    parentDocument (document) {
      return { text: document.parent_document_title, value: document.parent_document_id }
    },
    updateParentDocument (row, document) {
      row.parent_document_title = document.title
      row.parent_document_id = document.document_id
    },
    saveParentDocument (document) {
      Api.documents.update({
        id: document.document_id,
        model: document
      }).catch(info => {
        this.$notify.error('Error occured while updating document info: ' + info.toString())
      })
    },

    documentsSearchHandler: _.debounce(function (page = null, direction = null) {
      return this.documentsSearch({
        page,
        direction,
        filters: {
          project: this.projectId,
          query: this.searchQuery
        }
      })
    }, 300),

    cancelDeleteDocument () {
      this.showDeletionPrompt = false
      this.deletingDocument = null
    },
    showDeleteDocument (user) {
      this.deletingDocument = user
      this.showDeletionPrompt = true
    },
    deleteDocument () {
      this.isDocumentDeleting = true
      Api.documents.remove({
        id: this.deletingDocument.document_id
      }).then(() => {
        this.isDocumentDeleting = false
        this.deletingDocument = null
        this.showDeletionPrompt = false
        this.documentsSearchHandler()
      }).catch(info => {
        this.isDocumentDeleting = false
        this.$notify.error('Error occured while deleting document: ' + info.toString())
      })
    }
  },

  created () {
    this.documentsSearchHandler()
  }
}
</script>
