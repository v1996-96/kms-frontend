<template>
  <v-navigation-drawer app fixed right temporary :width="width" :value="showing" @input="setShowing($event)">
    <v-toolbar flat>
      <v-toolbar-title>
        Notifications
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleShowing">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list v-if="found" subheader>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>You have {{ count }} notifications total</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon ripple :disabled="isClearing" @click="clear">
            <v-icon color="grey">delete</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>

    <v-list v-if="found" subheader three-line>
      <v-list-tile href="#" avatar v-for="item in notificationsList" :key="item.notification_id">
        <v-list-tile-avatar size="42" color="grey">
          <v-badge left color="blue darken-2">
            <v-icon slot="badge" dark small>notifications</v-icon>
            <span class="white--text headline">J</span>
          </v-badge>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>Jordan Kercher - <span class="grey--text text--lighten-1">Some project</span></v-list-tile-title>
          <v-list-tile-sub-title>
            <small class="d-block">Commented {{ item.time_fired | timeAgoFilter }}</small>
            {{ item.content }}
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <!-- <v-icon slot="badge" dark small>chat_bubble</v-icon> -->
      <!-- <v-icon slot="badge" dark small>chat_bubble</v-icon> -->
    </v-list>

    <div v-if="!found" class="text-xs-center mt-4">
      <p>
        <img src="/static/notification.svg" width="100" />
      </p>
      <p class="subheading">
        There are no notifications for you yet
      </p>
    </div>
  </v-navigation-drawer>
</template>
<script>
import _ from 'lodash'
import DateFilters from '@/mixins/filters/date'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

const MARK_READ_TIMEOUT = 1000

export default {
  name: 'kms-template-notifications',
  mixins: [DateFilters],
  data: () => ({
    width: 370,

    isClearing: false
  }),
  computed: {
    ...mapState({
      'showing': s => s.Notifications.showing,
      'count': s => s.Notifications.count,
      'countUnread': s => s.Notifications.countUnread,
      'notificationsList': s => s.Notifications.list
    }),
    ...mapGetters({
      'found': 'Notifications/found'
    })
  },

  watch: {
    showing (value) {
      if (value) {
        _.delay(this.markRead, MARK_READ_TIMEOUT)
      }
    }
  },

  methods: {
    ...mapMutations({
      'toggleShowing': 'Notifications/toggleShowing',
      'setShowing': 'Notifications/setShowing'
    }),
    ...mapActions({
      'markRead': 'Notifications/markRead',
      'clearAction': 'Notifications/clear'
    }),

    clear () {
      this.isClearing = true
      this.clearAction().then(() => {
        this.isClearing = false
      }).catch((info) => {
        this.isClearing = false
      })
    }
  }
}
</script>
