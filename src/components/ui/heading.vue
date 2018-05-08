<template>
  <v-container fluid class="elevation-2 pb-0" :class="headingClass">
    <v-layout row wrap>
      <v-flex lg12>
        <slot name="breadcrumbs"></slot>

        <slot name="headers">
          <h1 class="headline">{{ heading }}</h1>
          <h3 class="subheading mb-2">{{ subheading }}</h3>
        </slot>
      </v-flex>
      <v-flex lg12>
        <slot></slot>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  name: 'kms-heading',
  props: {
    'dark': Boolean,
    'heading': String,
    'subheading': String
  },
  computed: {
    headingClass () {
      return this.dark ? [] : ['grey', 'lighten-4']
    }
  }
}
</script>
