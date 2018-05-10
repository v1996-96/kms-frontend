<template>
  <v-layout row wrap>
    <v-flex lg6 offset-lg3>
      <v-text-field v-if="!showPlaceholder" prepend-icon="search" class="mb-3" solo clearable label="Type search request here..." v-model="documentsQuery"></v-text-field>

      <div v-if="!documentsLoaded && documentsLoading" class="text-xs-center">
        <v-progress-circular indeterminate :size="50" color="primary"></v-progress-circular>
      </div>

      <div v-if="showPlaceholder" class="mt-4 text-xs-center">
        <p>
          <img src="/static/worker.svg" width="100" />
        </p>
        <p class="subheading">
          There is the place for your recently created documents
        </p>
      </div>

      <div v-if="showNothingFound" class="text-xs-center">
        <h3 class="mt-4">Nothing found</h3>
      </div>

      <div v-if="!documentsLoading && !documentsNotFound" class="mb-4">
        <v-list two-line subheader class="elevation-1 mb-3">
          <v-subheader>
            Found {{ documentsCount }} documents
            <v-spacer></v-spacer>
            <v-menu offset-y>
              <v-btn class="mr-0 pr-0" flat small slot="activator">{{ currentDraftVariant.name }} <v-icon>arrow_drop_down</v-icon></v-btn>
              <v-list dense>
                <v-list-tile v-for="type in DRAFT_FILTER_VARIANTS" :key="type.name" @click="displayOnlyDrafts = type.value">
                  <v-list-tile-title>{{ type.name }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-subheader>

          <v-list-tile avatar v-for="document in documentsResults" :key="document.document_id" :to="{ name: 'Document', params: { projectslug: document.project_slug, documentslug: document.slug } }">
            <v-list-tile-content>
              <v-list-tile-title>{{ document.title }} - <span class="grey--text text--lighten-1">{{ document.project_name }}</span></v-list-tile-title>
              <v-list-tile-sub-title>
                <small class="d-block">Created {{ document.date_created | timeAgoFilter }}</small>
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-menu bottom left>
                <v-btn icon slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list dense>
                  <v-list-tile href="#">
                    <v-list-tile-title>View</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile href="#">
                    <v-list-tile-title>Edit</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile href="#">
                    <v-list-tile-title>Delete</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>

        <div class="text-xs-center" v-if="documentsTotalPages > 1">
          <v-pagination :length="documentsTotalPages" :value="documentsPage" @input="documentsSearchHandler" total-visible="7" circle></v-pagination>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
import _ from 'lodash'
import Api from '@/api'
import Vue from 'vue'
import SearchPaginateMixin from '@/mixins/search-paginate'
import DocumentListModel from '@/models/document/list'
import TextFilters from '@/mixins/filters/text'
import DateFilters from '@/mixins/filters/date'

const DRAFT_FILTER_VARIANTS = [
  { name: 'All', value: null },
  { name: 'Drafts', value: true },
  { name: 'Not drafts', value: false }
]

export default {
  name: 'kms-my-work-documents-tab',
  mixins: [
    SearchPaginateMixin({
      namespace: 'documents',
      endpoint: Api.documents.getList,
      model: DocumentListModel,
      onError: (info) => Vue.notify.error('Error occured loading documents: ' + info.toString())
    }),
    TextFilters,
    DateFilters
  ],
  data: () => ({
    documentsQuery: '',
    displayOnlyDrafts: null,
    DRAFT_FILTER_VARIANTS
  }),

  computed: {
    showPlaceholder () {
      return ((!this.documentsLoaded && !this.documentsLoading) || (this.documentsLoaded && this.documentsNotFound)) && this.documentsQuery === ''
    },
    showNothingFound () {
      return this.documentsLoaded && this.documentsNotFound && this.documentsQuery !== ''
    },
    currentDraftVariant () {
      return _.find(DRAFT_FILTER_VARIANTS, { value: this.displayOnlyDrafts })
    }
  },

  watch: {
    documentsQuery () {
      this.documentsSearchHandler()
    },
    displayOnlyDrafts () {
      this.documentsSearchHandler()
    }
  },

  methods: {
    documentsSearchHandler: _.debounce(function (page = null, direction = null) {
      return this.documentsSearch({
        page,
        direction,
        filters: {
          query: this.documentsQuery,
          isDraft: this.displayOnlyDrafts
        }
      })
    }, 300)
  },

  created () {
    this.documentsLimit = 10
    this.documentsSearchHandler()
  }
}
</script>
