<template>
  <v-navigation-drawer app fixed :temporary="temporary" :clipped="true" :value="navigationShowing" @input="setNavigationShowing($event)" width="280">
    <template v-if="true">
      <v-list>
        <v-list-tile :to="{ name: 'Dashboard' }" exact>
          <v-list-tile-action><v-icon>dashboard</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Dashboard</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{ name: 'My-work' }" exact>
          <v-list-tile-action><v-icon>business_center</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>My work</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{ name: 'Projects' }" exact>
          <v-list-tile-action><v-icon>store</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Projects</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{ name: 'Settings' }" exact>
          <v-list-tile-action><v-icon>settings</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Settings</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list>
        <v-subheader>
          My projects
        </v-subheader>

        <p v-if="false" class="text-xs-center mt-2">
          <v-btn outline color="primary">Create new project</v-btn>
        </p>

        <v-list-tile href="#" two-line avatar>
          <v-list-tile-avatar size="38" color="grey">
            <span class="white--text headline">J</span>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Jordan Kercher</v-list-tile-title>
            <v-list-tile-sub-title><small>23 members</small></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="#" avatar>
          <v-list-tile-avatar size="38" color="grey">
            <span class="white--text headline">J</span>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Jordan Kercher</v-list-tile-title>
            <v-list-tile-sub-title><small>23 members</small></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </template>

    <template v-if="false">
      keklol
    </template>
  </v-navigation-drawer>
</template>
<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'kms-template-navigation',
  data: () => ({
    temporary: false
  }),
  computed: {
    ...mapState({
      'navigationShowing': s => s.App.navigationShowing
    })
  },
  watch: {
    '$route' (value, oldValue) {
      this.temporary = value.name === 'Editor'

      if (oldValue.name === 'Editor') {
        this.setNavigationShowing(true)
      }
    }
  },
  methods: {
    ...mapMutations({
      'setNavigationShowing': 'App/setNavigationShowing'
    })
  }
}
</script>
