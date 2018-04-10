<template>
  <v-app>
    <kms-template-navigation></kms-template-navigation>
    <kms-template-toolbar></kms-template-toolbar>
    <kms-template-notifications></kms-template-notifications>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>
<script>
export default {
  name: 'kms-app-layout'
}
</script>
