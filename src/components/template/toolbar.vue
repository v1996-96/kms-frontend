<template>
  <v-toolbar color="blue darken-3" dark app :clipped-left="$vuetify.breakpoint.lgAndUp" fixed class="elevation-3">
    <v-toolbar-title :style="titleStyle" class="ml-0 pl-1">
      <v-toolbar-side-icon @click.stop="toggleNavigationShowing"></v-toolbar-side-icon>
      <span class="hidden-sm-and-down ml-2">KMS</span>
    </v-toolbar-title>

    <v-menu v-model="showFastSearching" offset-y min-width="500">
      <v-text-field
        flat
        solo-inverted
        slot="activator"
        prepend-icon="search"
        label="Search"
        style="min-width: 500px"
        class="hidden-sm-and-down"></v-text-field>

      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>John Leider</v-list-tile-title>
              <v-list-tile-sub-title>Founder of Vuetify.js</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon>
                <v-icon>favorite</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-menu>

    <v-spacer></v-spacer>

    <v-btn icon @click="toggleNotifications" class="mr-4">
      <v-badge color="red">
        <span slot="badge">9</span>
        <v-icon>notifications</v-icon>
      </v-badge>
    </v-btn>
    <v-toolbar-items>
      <v-menu bottom offset-y left>
        <v-btn flat slot="activator">
          <v-avatar color="grey" size="40">v</v-avatar>
        </v-btn>
        <v-list>
          <v-list-tile><v-list-tile-title>Toggle theme</v-list-tile-title></v-list-tile>
          <v-list-tile><v-list-tile-title>Logout</v-list-tile-title></v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-toolbar>
</template>
<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'kms-template-toolbar',
  data: () => ({
    showFastSearching: false
  }),

  computed: {
    ...mapState({
      'navigationShowing': s => s.App.navigationShowing
    }),
    titleStyle () {
      return this.$vuetify.breakpoint.mdAndUp ? { width: '280px' } : {}
    }
  },

  methods: {
    ...mapMutations({
      'toggleNavigationShowing': 'App/toggleNavigationShowing',
      'toggleNotifications': 'Notifications/toggleShowing'
    })
  }
}
</script>
