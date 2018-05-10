<template>
  <v-toolbar :color="toolbarColor" dark app :clipped-left="$vuetify.breakpoint.lgAndUp" fixed class="elevation-3">
    <v-toolbar-side-icon @click.stop="toggleNavigationShowing"></v-toolbar-side-icon>
    <v-toolbar-title :style="titleStyle" class="ml-2 pl-1">
      <router-link style="text-decoration: none" class="hidden-sm-and-down ml-2 white--text" :to="{ name: 'Dashboard' }">
        KMS
      </router-link>
    </v-toolbar-title>

    <v-menu v-model="showFastSearching" offset-y min-width="500" attach=".toolbar-search-input">
      <v-text-field
        flat
        solo-inverted
        slot="activator"
        prepend-icon="search"
        label="Search"
        style="min-width: 500px"
        class="hidden-sm-and-down toolbar-search-input"></v-text-field>

      <v-card>
        <v-list class="pb-1" :light="!darkTheme">
          <v-list-tile avatar href="#">
            <v-list-tile-avatar color="grey"><span class="white--text headline">J</span></v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Tesla model 3 - <span class="grey--text">Project</span></v-list-tile-title>
              <v-list-tile-sub-title>
                Short description on here...
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile avatar href="#">
            <v-list-tile-avatar color="grey"><span class="white--text headline">J</span></v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Tesla model s - <span class="grey--text">Project</span></v-list-tile-title>
              <v-list-tile-sub-title>
                Another short description on here...
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile avatar href="#">
            <v-list-tile-avatar color="grey"><span class="white--text headline">L</span></v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>John Leider - <span class="grey--text">People</span></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile avatar href="#">
            <v-list-tile-avatar color="grey"><span class="white--text headline">E</span></v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Document title here - <span class="grey--text">Document</span></v-list-tile-title>
              <v-list-tile-sub-title>
                Short passage from the article
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile avatar href="#">
            <v-list-tile-avatar color="grey"><span class="white--text headline">E</span></v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Document title here - <span class="grey--text">Document</span></v-list-tile-title>
              <v-list-tile-sub-title>
                Short passage from the article
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-layout align-center class="pl-3">
            <span>Found 12 entries</span>
            <v-spacer></v-spacer>
            <v-btn flat small :light="!darkTheme">Advanced search</v-btn>
          </v-layout>
        </v-list>
      </v-card>
    </v-menu>

    <v-spacer></v-spacer>

    <v-btn icon @click="toggleNotifications" class="mr-4">
      <v-badge color="red">
        <span slot="badge" v-if="notificationsUnread > 0">{{ notificationsUnreadMsg }}</span>
        <v-icon>notifications</v-icon>
      </v-badge>
    </v-btn>
    <v-toolbar-items>
      <v-menu bottom offset-y left>
        <v-btn flat slot="activator">
          <v-avatar color="grey" size="40">v</v-avatar>
        </v-btn>
        <v-list>
          <v-list-tile :to="{ name: 'My-profile' }" exact><v-list-tile-title>Profile</v-list-tile-title></v-list-tile>
          <v-list-tile @click="toggleDarkTheme"><v-list-tile-title>Toggle theme</v-list-tile-title></v-list-tile>
          <v-list-tile @click="logout"><v-list-tile-title>Logout</v-list-tile-title></v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-toolbar>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'kms-template-toolbar',
  data: () => ({
    showFastSearching: false
  }),

  computed: {
    ...mapState({
      'notificationsUnread': s => s.Notifications.countUnread,
      'darkTheme': s => s.App.darkTheme,
      'navigationShowing': s => s.App.navigationShowing
    }),
    ...mapGetters({
      'notificationsUnreadMsg': 'Notifications/countUnread'
    }),
    toolbarColor () {
      return this.darkTheme ? '' : 'blue darken-3'
    },
    titleStyle () {
      return this.$vuetify.breakpoint.mdAndUp ? { width: '220px' } : {}
    }
  },

  methods: {
    ...mapMutations({
      'toggleDarkTheme': 'App/toggleDarkTheme',
      'toggleNavigationShowing': 'App/toggleNavigationShowing',
      'toggleNotifications': 'Notifications/toggleShowing'
    }),
    ...mapActions({
      'logoutAction': 'Account/logout'
    }),

    logout () {
      this.logoutAction().then(() => {
        this.$router.push({ name: 'Signin' })
      }).catch(() => {
        this.$router.push({ name: 'Signin' })
      })
    }
  }
}
</script>
