<template>
  <v-toolbar color="blue darken-3" dark app :clipped-left="$vuetify.breakpoint.lgAndUp" fixed class="elevation-1">
    <v-toolbar-title style="width: 280px" class="ml-0 pl-1">
      <v-toolbar-side-icon @click.stop="toggleNavigationCollapsed"></v-toolbar-side-icon>
      <span class="hidden-sm-and-down ml-2">KMS</span>
    </v-toolbar-title>

    <v-text-field
      flat
      solo-inverted
      prepend-icon="search"
      label="Search"
      class="hidden-sm-and-down"></v-text-field>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>notifications</v-icon>
    </v-btn>
  </v-toolbar>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  name: 'kms-template-toolbar',
  methods: {
    ...mapMutations({
      'toggleNavigationCollapsed': 'App/toggleNavigationCollapsed'
    })
  }
}
</script>
