<template>
  <v-navigation-drawer app fixed :clipped="true" :value="navigationShowing" @input="setNavigationShowing($event)" width="280">
    <v-list>
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

    <v-list>
      <v-subheader>
        Projects
        <v-spacer></v-spacer>
        <v-btn class="mr-0" fab flat small>
          <v-icon>add</v-icon>
        </v-btn>
      </v-subheader>

      <!-- <v-subheader class="mt-2 blue--text text--darken-3 justify-center">
        Create new amazing project
      </v-subheader> -->

      <v-list-tile href="#" avatar>
        <v-list-tile-avatar size="34" color="grey">
          <span class="white--text headline">J</span>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>Jordan Kercher</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile href="#" avatar>
        <v-list-tile-avatar size="34" color="grey">
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
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'kms-template-navigation',
  data: () => ({}),
  computed: {
    ...mapState({
      'navigationShowing': s => s.App.navigationShowing
    })
  },
  methods: {
    ...mapMutations({
      'setNavigationShowing': 'App/setNavigationShowing'
    })
  }
}
</script>
