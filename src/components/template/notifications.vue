<template>
  <v-navigation-drawer app fixed right temporary :value="showing" @input="setShowing($event)">
    <v-toolbar flat>
      <v-toolbar-title>
        Notifications
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleShowing">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list class="pt-0">
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>Total 123 notifications</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon ripple>
            <v-icon color="error">delete</v-icon>
          </v-btn>
        </v-list-tile-action>
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
  name: 'kms-template-notifications',
  data: () => ({}),
  computed: {
    ...mapState({
      'showing': s => s.Notifications.showing
    })
  },
  methods: {
    ...mapMutations({
      'toggleShowing': 'Notifications/toggleShowing',
      'setShowing': 'Notifications/setShowing'
    })
  }
}
</script>
