<template>
  <v-card>
    <v-card-title class="pt-2">
      <v-text-field hide-details prepend-icon="search" class="mb-3" clearable label="Type search request here..." v-model="searchQuery"></v-text-field>
      <v-spacer></v-spacer>
      <v-dialog v-model="creationDialog" max-width="290">
        <v-btn slot="activator" color="primary" class="mr-0">Create competence</v-btn>
        <v-card>
          <v-card-title class="headline">Use Google's location service?</v-card-title>
          <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click.native="creationDialog = false">Disagree</v-btn>
            <v-btn color="green darken-1" flat @click.native="creationDialog = false">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>

    <v-data-table
      search=""
      :headers="COMPETENCES_TABLE_HEADERS"
      :items="competencesResults"
      :loading="competencesLoading"
      :pagination.sync="pagination"
      :total-items="competencesCount"
      :rows-per-page-items="rowsPerPageItems"
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>
          <v-edit-dialog lazy>
            <span v-if="props.item.name !== ''">{{ props.item.name }}</span>
            <span v-else>Click here to enter competence name</span>
            <v-text-field
              slot="input"
              v-model="props.item.name"
              @blur="updateCompetence(props.item)"
              label="Competence"
              single-line
              autofocus></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-btn flat small color="error" @click="showDeleteCompetence(props.item)">
            Delete
          </v-btn>
        </td>
      </template>
    </v-data-table>

    <v-dialog v-model="showDeletionPrompt" max-width="310">
      <v-card>
        <v-card-title class="headline">Delete competence?</v-card-title>
        <v-card-text v-if="deletingCompetence" class="text-xs-center">
          {{ deletingCompetence.name }}
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click.native="showDeletionPrompt = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" depressed @click="deleteCompetence" :loading="isCompetenceDeleting" :disabled="isCompetenceDeleting">Delete</v-btn>
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
import CompetenceListModel from '@/models/competence/list'
import { COMPETENCES_TABLE_HEADERS } from './config'

export default {
  name: 'kms-competence-settings-competences-tab',
  mixins: [
    SearchPaginateMixin({
      namespace: 'competences',
      endpoint: Api.competences.getList,
      model: CompetenceListModel,
      onError: (info) => Vue.notify.error('Error occured loading competences: ' + info.toString())
    }),
    TextFiltersMixin,
    DateFiltersMixin
  ],
  data: () => ({
    COMPETENCES_TABLE_HEADERS,
    showDeletionPrompt: false,
    deletingCompetence: null,
    creationDialog: null,
    isCompetenceDeleting: false,
    searchQuery: '',
    rowsPerPageItems: [5, 10, 30, 50, 100],
    pagination: { rowsPerPage: 50 }
  }),

  watch: {
    searchQuery () {
      this.competencesSearchHandler()
    },
    pagination (value, oldValue) {
      if (value.rowsPerPage !== oldValue.rowsPerPage) {
        this.competencesLimit = value.rowsPerPage
      }

      this.competencesSearchHandler(value.page)
    }
  },

  methods: {
    competencesSearchHandler: _.debounce(function (page = null, direction = null) {
      return this.competencesSearch({
        page,
        direction,
        filters: {
          query: this.searchQuery
        }
      })
    }, 300),

    updateCompetence (competence) {
      Api.competences.update({
        id: competence.competence_id,
        model: competence
      }).catch(info => {
        this.$notify.error('Error occured while updating competence: ' + info.toString())
      })
    },

    cancelDeleteCompetence () {
      this.showDeletionPrompt = false
      this.deletingCompetence = null
    },
    showDeleteCompetence (user) {
      this.deletingCompetence = user
      this.showDeletionPrompt = true
    },
    deleteCompetence () {
      this.isCompetenceDeleting = true
      Api.competences.remove({
        id: this.deletingCompetence.competence_id
      }).then(() => {
        this.isCompetenceDeleting = false
        this.deletingCompetence = null
        this.showDeletionPrompt = false
        this.competencesSearchHandler()
      }).catch(info => {
        this.isCompetenceDeleting = false
        this.$notify.error('Error occured while deleting competence: ' + info.toString())
      })
    }
  },

  created () {
    this.competencesSearchHandler()
  }
}
</script>
