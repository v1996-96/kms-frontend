<template>
  <v-card>
    <!-- <v-card-title class="pt-2">
      <v-text-field hide-details prepend-icon="search" class="mb-3" clearable label="Type search request here..." v-model="searchQuery"></v-text-field>
    </v-card-title> -->

    <v-data-table
      search=""
      :headers="headers"
      :items="attachmentsResults"
      :loading="attachmentsLoading"
      :pagination.sync="pagination"
      :total-items="attachmentsCount"
      :rows-per-page-items="rowsPerPageItems"
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>
          <v-edit-dialog lazy>
            <span v-if="props.item.name !== ''">{{ props.item.name }}</span>
            <span v-else>Click here to enter name</span>
            <v-text-field
              slot="input"
              v-model="props.item.name"
              @blur="updateAttachment(props.item)"
              label="Attachment name"
              single-line
              autofocus></v-text-field>
          </v-edit-dialog>
        </td>
        <td>{{ props.item.time_created | dateTimeFilter }}</td>
        <td>
          <v-btn fab flat icon small :href="props.item.link" target="_blank">
            <v-icon>attachment</v-icon>
          </v-btn>
          <v-btn fab flat icon small color="error" @click="showDeleteAttachment(props.item)">
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>

    <v-dialog v-model="showDeletionPrompt" max-width="310">
      <v-card>
        <v-card-title class="headline">Delete attachment?</v-card-title>
        <v-card-text v-if="deletingAttachment" class="text-xs-center">
          {{ deletingAttachment.name }}
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click.native="showDeletionPrompt = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" depressed @click="deleteAttachment" :loading="isAttachmentDeleting" :disabled="isAttachmentDeleting">Delete</v-btn>
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
import DateFiltersMixin from '@/mixins/filters/date'
import AttachmentListModel from '@/models/attachment/list'

export const TABLE_HEADERS = [
  { text: 'Name', value: 'name', sortable: false },
  { text: 'Date created', value: 'time_created', sortable: false },
  { text: 'Actions', value: 'actions', sortable: false, width: 180 }
]

export default {
  name: 'kms-document-settings-attachments-tab',
  props: {
    'documentId': [Number, String]
  },
  mixins: [
    SearchPaginateMixin({
      namespace: 'attachments',
      endpoint: Api.documents.getAttachments,
      model: AttachmentListModel,
      onError: (info) => Vue.notify.error('Error occured loading attachments: ' + info.toString())
    }),
    TextFiltersMixin,
    DateFiltersMixin
  ],
  data: () => ({
    headers: TABLE_HEADERS,
    showDeletionPrompt: false,
    deletingAttachment: null,
    isAttachmentDeleting: false,
    searchQuery: '',
    rowsPerPageItems: [5, 10, 30, 50, 100],
    pagination: { rowsPerPage: 50 }
  }),

  watch: {
    searchQuery () {
      this.attachmentsSearchHandler()
    },
    pagination (value, oldValue) {
      if (value.rowsPerPage !== oldValue.rowsPerPage) {
        this.attachmentsLimit = value.rowsPerPage
      }

      this.attachmentsSearchHandler(value.page)
    }
  },

  methods: {
    parentAttachment (attachment) {
      return { text: attachment.parent_attachment_title, value: attachment.parent_attachment_id }
    },
    updateParentAttachment (row, attachment) {
      row.parent_attachment_title = attachment.title
      row.parent_attachment_id = attachment.attachment_id
    },
    saveParentAttachment (attachment) {
      Api.documents.updateAttachment({
        id: this.documentId,
        attachmentId: attachment.attachment_id,
        model: attachment
      }).catch(info => {
        this.$notify.error('Error occured while updating attachment info: ' + info.toString())
      })
    },

    attachmentsSearchHandler: _.debounce(function (page = null, direction = null) {
      return this.attachmentsSearch({
        page,
        direction,
        filters: {
          id: this.documentId,
          query: this.searchQuery
        }
      })
    }, 300),

    cancelDeleteAttachment () {
      this.showDeletionPrompt = false
      this.deletingAttachment = null
    },
    showDeleteAttachment (user) {
      this.deletingAttachment = user
      this.showDeletionPrompt = true
    },
    deleteAttachment () {
      this.isAttachmentDeleting = true
      Api.documents.removeAttachment({
        id: this.documentId,
        attachmentId: this.deletingAttachment.attachment_id
      }).then(() => {
        this.isAttachmentDeleting = false
        this.deletingAttachment = null
        this.showDeletionPrompt = false
        this.attachmentsSearchHandler()
      }).catch(info => {
        this.isAttachmentDeleting = false
        this.$notify.error('Error occured while deleting attachment: ' + info.toString())
      })
    },
    updateAttachment (attachment) {
      Api.documents.updateAttachment({
        id: this.documentId,
        attachmentId: attachment.attachment_id,
        model: attachment
      }).catch(info => {
        this.$notify.error('Error occured while updating attachment info: ' + info.toString())
      })
    }
  },

  created () {
    this.attachmentsSearchHandler()
  }
}
</script>
