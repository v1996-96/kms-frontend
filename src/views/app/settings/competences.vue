<template>
  <v-card>
    <v-card-title class="pt-2">
      <v-text-field hide-details prepend-icon="search" class="mb-3" clearable label="Type search request here..." v-model="searchQuery"></v-text-field>
      <v-spacer></v-spacer>
      <v-dialog v-model="creationDialog" max-width="310">
        <v-btn slot="activator" color="primary" class="mr-0">Create competence</v-btn>
        <v-card>
          <v-card-title class="headline">Create new competence</v-card-title>
          <v-card-text>
            <v-text-field required v-model="competenceText" :error-messages="competenceTextErrors" @input="$v.competenceText.$touch()" @blur="$v.competenceText.$touch()" label="Competence"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click.native="creationDialog = false">Cancel</v-btn>
            <v-btn color="primary" flat @click="create" :disabled="isCompetenceCreating || $v.$invalid" :loading="isCompetenceCreating">Create</v-btn>
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
import { required } from 'vuelidate/lib/validators'

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
    isCompetenceCreating: false,
    competenceText: '',
    searchQuery: '',
    rowsPerPageItems: [5, 10, 30, 50, 100],
    pagination: { rowsPerPage: 50 }
  }),

  computed: {
    competenceTextErrors () {
      const errors = []
      if (!this.$v.competenceText.$dirty) return errors
      !this.$v.competenceText.required && errors.push('You must enter competence name')
      return errors
    }
  },

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

  validations: {
    competenceText: { required }
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

    create () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }

      this.isCompetenceCreating = true
      Api.competences.create({ name: this.competenceText }).then((response) => {
        this.isCompetenceCreating = false
        this.creationDialog = false
        this.$notify.success('Competence was created successfully')
        this.competencesSearchHandler()
      }).catch((info) => {
        this.isCompetenceCreating = false
        this.$notify.error('Error occured while creating competence: ' + info.toString())
      })
    },

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
