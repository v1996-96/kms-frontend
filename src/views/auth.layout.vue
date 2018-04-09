<template>
  <v-app class="blue darken-3">
    <v-content>

      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <router-view/>
          </v-flex>
        </v-layout>
      </v-container>

    </v-content>
  </v-app>
</template>
