<template>
  <v-navigation-drawer app fixed :clipped="$vuetify.breakpoint.lgAndUp" :mini-variant="navigation" width="280">
    <v-list dense>
      <v-list-tile href="#">
        <v-list-tile-action><v-icon>business_center</v-icon></v-list-tile-action>
        <v-list-tile-content><v-list-tile-title>My work</v-list-tile-title></v-list-tile-content>
      </v-list-tile>
      <v-list-tile href="#">
        <v-list-tile-action><v-icon>link</v-icon></v-list-tile-action>
        <v-list-tile-content><v-list-tile-title>Quick links</v-list-tile-title></v-list-tile-content>
      </v-list-tile>
      <v-list-tile href="#">
        <v-list-tile-action><v-icon>bookmark</v-icon></v-list-tile-action>
        <v-list-tile-content><v-list-tile-title>Bookmarks</v-list-tile-title></v-list-tile-content>
      </v-list-tile>
      <v-list-tile href="#">
        <v-list-tile-action><v-icon>star</v-icon></v-list-tile-action>
        <v-list-tile-content><v-list-tile-title>Following</v-list-tile-title></v-list-tile-content>
      </v-list-tile>
      <v-list-tile href="#">
        <v-list-tile-action><v-icon>settings</v-icon></v-list-tile-action>
        <v-list-tile-content><v-list-tile-title>Settings</v-list-tile-title></v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-list dense>
      <v-subheader>
        Projects
        <v-spacer></v-spacer>
        <v-btn class="mr-0" fab flat small>
          <v-icon>add</v-icon>
        </v-btn>
      </v-subheader>

      <v-list-tile href="#" avatar>
        <v-list-tile-avatar color="grey">
          <span class="white--text headline">J</span>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>Jordan Kercher</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile href="#" avatar>
        <v-list-tile-avatar color="grey">
          <span class="white--text headline">J</span>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>Jordan Kercher</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'kms-template-navigation',
  data: () => ({}),
  computed: {
    ...mapState({
      'navigation': s => s.App.navigation
    })
  }
}
</script>
