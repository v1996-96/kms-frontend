<template>
  <v-layout row wrap>
    <v-flex lg6 offset-lg3>
      <v-text-field v-if="!showPlaceholder" prepend-icon="search" class="mb-3" solo clearable label="Type search request here..." v-model="bookmarksQuery"></v-text-field>

      <div v-if="!bookmarksLoaded && bookmarksLoading" class="text-xs-center">
        <v-progress-circular indeterminate :size="50" color="primary"></v-progress-circular>
      </div>

      <div v-if="showPlaceholder" class="mt-4 text-xs-center">
        <p>
          <img src="/static/shapes.svg" width="100" />
        </p>
        <p class="subheading">
          Bookmarks are the best way to point out the most interesting content. You can create them by clicking the <v-icon>bookmark</v-icon> icon on the entries
        </p>
      </div>

      <div v-if="showNothingFound" class="text-xs-center">
        <h3 class="mt-4">Nothing found</h3>
      </div>

      <div v-if="!bookmarksLoading && !bookmarksNotFound" class="mb-4">
        <v-list two-line subheader class="elevation-1 mb-3">
          <v-subheader>
            Found {{ bookmarksCount }} bookmarks
          </v-subheader>

          <v-list-tile avatar href="#" v-for="bookmark in bookmarksResults" :key="bookmark.bookmark_id">
            <v-list-tile-content>
              <v-list-tile-title>{{ bookmark.document_title }}</v-list-tile-title>
              <v-list-tile-sub-title>
                <small class="d-block">Created {{ bookmark.time_created | timeAgoFilter }}</small>
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple @click="removeBookmark(bookmark.bookmark_id)" :disabled="isBookmarkRemoving">
                <v-icon color="red lighten-1">delete</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>

        <div class="text-xs-center" v-if="bookmarksTotalPages > 1">
          <v-pagination :length="bookmarksTotalPages" :value="bookmarksPage" @input="bookmarksSearchHandler" total-visible="7" circle></v-pagination>
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
import BookmarkListModel from '@/models/bookmark/list'
import TextFilters from '@/mixins/filters/text'
import DateFilters from '@/mixins/filters/date'

export default {
  name: 'kms-my-work-bookmarks-tab',
  mixins: [
    SearchPaginateMixin({
      namespace: 'bookmarks',
      endpoint: Api.bookmarks.getList,
      model: BookmarkListModel,
      onError: (info) => Vue.notify.error('Error occured loading bookmarks: ' + info.toString())
    }),
    TextFilters,
    DateFilters
  ],
  data: () => ({
    isBookmarkRemoving: false,

    bookmarksQuery: '',
    displayOnlyDrafts: null
  }),

  computed: {
    showPlaceholder () {
      return ((!this.bookmarksLoaded && !this.bookmarksLoading) || (this.bookmarksLoaded && this.bookmarksNotFound)) && this.bookmarksQuery === ''
    },
    showNothingFound () {
      return this.bookmarksLoaded && this.bookmarksNotFound && this.bookmarksQuery !== ''
    }
  },

  watch: {
    bookmarksQuery (value) {
      this.bookmarksSearchHandler()
    }
  },

  methods: {
    bookmarksSearchHandler: _.debounce(function (page = null, direction = null) {
      return this.bookmarksSearch({
        page,
        direction,
        filters: {
          query: this.bookmarksQuery,
          isDraft: this.displayOnlyDrafts
        }
      })
    }, 300),

    removeBookmark (id) {
      this.isBookmarkRemoving = true
      return Api.bookmarks.remove({ id }).then(() => {
        this.isBookmarkRemoving = false
        this.bookmarksSearchHandler()
      }).catch(info => {
        this.isBookmarkRemoving = false
        this.$notify.error('Error deleting bookmark: ' + info.toString())
      })
    }
  },

  created () {
    this.bookmarksLimit = 10
    this.bookmarksSearchHandler()
  }
}
</script>
