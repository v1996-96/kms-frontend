<template>
  <v-layout row wrap>
    <v-flex lg6 offset-lg3>
      <v-text-field v-if="!showPlaceholder" prepend-icon="search" class="mb-3" solo clearable label="Type search request here..." v-model="followingQuery"></v-text-field>

      <div v-if="!followingLoaded && followingLoading" class="text-xs-center">
        <v-progress-circular indeterminate :size="50" color="primary"></v-progress-circular>
      </div>

      <div v-if="showPlaceholder" class="mt-4 text-xs-center">
        <p>
          <img src="/static/follow.svg" width="100" />
        </p>
        <p class="subheading">
          You can track changes and comments on the entries by following them
        </p>
      </div>

      <div v-if="showNothingFound" class="text-xs-center">
        <h3 class="mt-4">Nothing found</h3>
      </div>

      <div v-if="!followingLoading && !followingNotFound" class="mb-4">
        <v-list two-line subheader class="elevation-1 mb-3">
          <v-subheader>
            Found {{ followingCount }} following
          </v-subheader>

          <v-list-tile avatar href="#" v-for="following in followingResults" :key="following.following_id">
            <v-list-tile-avatar :color="following.avatar ? '' : 'grey'">
              <img v-if="following.avatar" :src="following.avatar" />
              <span v-else class="white--text headline">{{ following.project_name | firstLetterFilter }}</span>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ following.project_name }}</v-list-tile-title>
              <v-list-tile-sub-title>
                <small class="d-block">Created {{ following.time_created | timeAgoFilter }}</small>
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple @click="removeFollowing(following.following_id)" :disabled="isFollowingRemoving">
                <v-icon color="red lighten-1">delete</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>

        <div class="text-xs-center" v-if="followingTotalPages > 1">
          <v-pagination :length="followingTotalPages" :value="followingPage" @input="followingSearchHandler" total-visible="7" circle></v-pagination>
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
import FollowingListModel from '@/models/following/list'
import TextFilters from '@/mixins/filters/text'
import DateFilters from '@/mixins/filters/date'

export default {
  name: 'kms-my-work-following-tab',
  mixins: [
    SearchPaginateMixin({
      namespace: 'following',
      endpoint: Api.following.getList,
      model: FollowingListModel,
      onError: (info) => Vue.notify.error('Error occured loading following: ' + info.toString())
    }),
    TextFilters,
    DateFilters
  ],
  data: () => ({
    isFollowingRemoving: false,

    followingQuery: '',
    displayOnlyDrafts: null
  }),

  computed: {
    showPlaceholder () {
      return ((!this.followingLoaded && !this.followingLoading) || (this.followingLoaded && this.followingNotFound)) && this.followingQuery === ''
    },
    showNothingFound () {
      return this.followingLoaded && this.followingNotFound && this.followingQuery !== ''
    }
  },

  watch: {
    followingQuery (value) {
      this.followingSearchHandler()
    }
  },

  methods: {
    followingSearchHandler: _.debounce(function (page = null, direction = null) {
      return this.followingSearch({
        page,
        direction,
        filters: {
          query: this.followingQuery,
          isDraft: this.displayOnlyDrafts
        }
      })
    }, 300),

    removeFollowing (id) {
      this.isFollowingRemoving = true
      return Api.following.remove({ id }).then(() => {
        this.isFollowingRemoving = false
        this.followingSearchHandler()
      }).catch(info => {
        this.isFollowingRemoving = false
        this.$notify.error('Error deleting following marked project: ' + info.toString())
      })
    }
  },

  created () {
    this.followingLimit = 10
    this.followingSearchHandler()
  }
}
</script>
