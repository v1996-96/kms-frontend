<template>
  <div>
    <div v-if="!activityLoaded && !activityLoading || activityLoaded && activityNotFound" class="text-xs-center">
      <h3 class="title mt-2">There is no activity yet</h3>
    </div>

    <v-list two-line subheader class="elevation-1" v-if="activityLoaded && !activityNotFound">
      <v-list-tile avatar href="#" v-for="item in activityResults" :key="item.activity_id">
        <v-list-tile-avatar class="mr-2" size="35" :color="item.issuer.avatar ? '' : 'grey'">
          <img v-if="item.issuer.avatar" :src="item.issuer.avatar" />
          <span v-else class="white--text headline">{{ item.issuer.name | firstLetterFilter }}</span>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title><span v-if="item.issuer">{{ item.issuer.name }} {{ item.issuer.surname }}</span></v-list-tile-title>
          <v-list-tile-sub-title class="text--primary">
            <small class="d-block">Commented {{ item.time_fired | timeAgoFilter }}</small>
            {{ item.content }}
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn fab flat small>
            <v-icon color="grey lighten-1">chevron_right</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>

      <div class="text-xs-center" v-if="activityCanLoadMore">
        <v-btn depressed :loading="activityLoading" :disabled="activityLoading" @click="activityLoadMore">Load more</v-btn>
      </div>
    </v-list>
  </div>
</template>
<script>
import Vue from 'vue'
import Api from '@/api'
import TextFiltersMixin from '@/mixins/filters/text'
import DateFiltersMixin from '@/mixins/filters/date'
import SearchAppendMixin from '@/mixins/search-append'
import ActivityListModel from '@/models/activity/list'

export default {
  name: 'kms-project-activity',
  props: {
    'projectId': [Number, String]
  },
  mixins: [
    SearchAppendMixin({
      namespace: 'activity',
      model: ActivityListModel,
      endpoint: Api.activity.getList,
      onError: (info) => Vue.notify.error('Error occured while loading project activity: ' + info.toString())
    }),
    DateFiltersMixin,
    TextFiltersMixin
  ],

  computed: {
    filters () {
      return {
        project: this.projectId
      }
    }
  },

  watch: {
    projectId () {
      this.activitySearch(this.filters)
    }
  },

  created () {
    this.activityLimit = 10
    this.activitySearch(this.filters)
  }
}
</script>
