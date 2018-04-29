<template>
  <v-app :dark="darkTheme">
    <kms-template-navigation></kms-template-navigation>
    <kms-template-toolbar></kms-template-toolbar>
    <kms-template-notifications></kms-template-notifications>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'kms-app-layout',
  computed: {
    ...mapState({
      'darkTheme': s => s.App.darkTheme
    }),
    ...mapGetters({
      'profileLoaded': 'Account/profileLoaded'
    })
  },
  methods: {
    ...mapActions({
      'setupNotificationsWatcher': 'Notifications/setupAsyncLoop',
      'getProfile': 'Account/getProfile'
    }),
    ...mapMutations({
      'staratNotificationsWatcher': 'Notifications/startLoop',
      'stopNotificationsWatcher': 'Notifications/stopLoop'
    }),

    init () {
      this.setupNotificationsWatcher()
      this.staratNotificationsWatcher()

      if (!this.profileLoaded) {
        this.getProfile()
      }
    },

    destroy () {
      this.stopNotificationsWatcher()
    }
  },

  created () {
    this.init()
  },
  beforeDestroy () {
    this.destroy()
  },
  beforeRouteLeave (to, from, next) {
    this.destroy()
    next()
  }
}
</script>
