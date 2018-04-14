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
import { mapState } from 'vuex'

export default {
  name: 'kms-app-layout',
  computed: {
    ...mapState({
      'darkTheme': s => s.App.darkTheme
    })
  }
}
</script>
