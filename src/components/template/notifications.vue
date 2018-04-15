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

    <v-list v-if="true" subheader>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>Total 123 notifications</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon ripple>
            <v-icon color="grey">delete</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>

    <v-list v-if="true" subheader three-line>
      <v-list-tile href="#" avatar>
          <v-list-tile-avatar size="42" color="grey">
            <v-badge left color="blue darken-2">
              <v-icon slot="badge" dark small>notifications</v-icon>
              <span class="white--text headline">J</span>
            </v-badge>
          </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>Jordan Kercher - <span class="grey--text text--lighten-1">Some project</span></v-list-tile-title>
          <v-list-tile-sub-title>
            <small class="d-block">Commented 2 minutes ago</small>
            Some awesome comment
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile href="#" avatar>
        <v-list-tile-avatar size="42" color="grey">
          <v-badge left color="yellow darken-3">
            <v-icon slot="badge" dark small>chat_bubble</v-icon>
            <span class="white--text headline">J</span>
          </v-badge>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>Jordan Kercher - <span class="grey--text text--lighten-1">Some project</span></v-list-tile-title>
          <v-list-tile-sub-title>
            <small class="d-block">Commented 2 minutes ago</small>
            Some awesome comment
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile href="#" avatar>
        <v-list-tile-avatar size="42" color="grey">
          <v-badge left color="green">
            <v-icon slot="badge" dark small>create</v-icon>
            <span class="white--text headline">J</span>
          </v-badge>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>Jordan Kercher - <span class="grey--text text--lighten-1">Some project</span></v-list-tile-title>
          <v-list-tile-sub-title>
            <small class="d-block">Commented 2 minutes ago</small>
            Some awesome comment
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <div v-if="false" class="text-xs-center mt-4">
      <p>
        <img src="/static/notification.svg" width="100" />
      </p>
      <p class="subheading">
        There are not notifications for you yet
      </p>
    </div>
  </v-navigation-drawer>
</template>
<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'kms-template-notifications',
  data: () => ({
    width: 370
  }),
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
