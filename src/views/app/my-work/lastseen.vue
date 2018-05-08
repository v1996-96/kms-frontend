<template>
  <v-layout row wrap>
    <v-flex lg6 offset-lg3>
      <v-text-field v-if="!showPlaceholder" prepend-icon="search" class="mb-3" solo clearable label="Type search request here..." v-model="lastseenQuery"></v-text-field>

      <div v-if="!lastseenLoaded && lastseenLoading" class="text-xs-center">
        <v-progress-circular indeterminate :size="50" color="primary"></v-progress-circular>
      </div>

      <div v-if="showPlaceholder" class="mt-4 text-xs-center">
        <p>
          <img src="/static/history.svg" width="100" />
        </p>
        <p class="subheading">
          There you will see your navigation history
        </p>
      </div>

      <div v-if="showNothingFound" class="text-xs-center">
        <h3 class="mt-4">Nothing found</h3>
      </div>

      <div v-if="!lastseenLoading && !lastseenNotFound" class="mb-4">
        <v-list two-line subheader class="elevation-1 mb-3">
          <v-subheader>
            Found {{ lastseenCount }} lastseen
            <v-spacer></v-spacer>
            <v-btn flat small class="mr-0" @click="clearAll" :disabled="isClearingAll" :loading="isClearingAll">Clear</v-btn>
          </v-subheader>

          <v-list-tile avatar href="#" v-for="lastseen in lastseenResults" :key="lastseen.lastseen_id">
            <v-list-tile-content>
              <v-list-tile-title>{{ lastseen.document_title }}</v-list-tile-title>
              <v-list-tile-sub-title>
                <small class="d-block">Visited {{ lastseen.time_created | timeAgoFilter }}</small>
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <div class="text-xs-center" v-if="lastseenTotalPages > 1">
          <v-pagination :length="lastseenTotalPages" :value="lastseenPage" @input="lastseenSearchHandler" total-visible="7" circle></v-pagination>
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
import LastSeenListModel from '@/models/lastseen/list'
import TextFilters from '@/mixins/filters/text'
import DateFilters from '@/mixins/filters/date'

export default {
  name: 'kms-my-work-lastseen-tab',
  mixins: [
    SearchPaginateMixin({
      namespace: 'lastseen',
      endpoint: Api.lastseen.getList,
      model: LastSeenListModel,
      onError: (info) => Vue.notify.error('Error occured loading lastseen: ' + info.toString())
    }),
    TextFilters,
    DateFilters
  ],
  data: () => ({
    isClearingAll: false,
    lastseenQuery: '',
    displayOnlyDrafts: null
  }),

  computed: {
    showPlaceholder () {
      return ((!this.lastseenLoaded && !this.lastseenLoading) || (this.lastseenLoaded && this.lastseenNotFound)) && this.lastseenQuery === ''
    },
    showNothingFound () {
      return this.lastseenLoaded && this.lastseenNotFound && this.lastseenQuery !== ''
    }
  },

  watch: {
    lastseenQuery (value) {
      this.lastseenSearchHandler()
    }
  },

  methods: {
    lastseenSearchHandler: _.debounce(function (page = null, direction = null) {
      return this.lastseenSearch({
        page,
        direction,
        filters: {
          query: this.lastseenQuery,
          isDraft: this.displayOnlyDrafts
        }
      })
    }, 300),

    clearAll () {
      this.isClearingAll = true
      return Api.lastseen.clear().then(() => {
        this.isClearingAll = false
        this.lastseenSearchHandler()
      }).catch(info => {
        this.isClearingAll = false
        this.$notify.error('Error clearing view history: ' + info.toString())
      })
    }
  },

  created () {
    this.lastseenLimit = 10
    this.lastseenSearchHandler()
  }
}
</script>
