<template>
  <v-toolbar :color="toolbarColor" dark app :clipped-left="$vuetify.breakpoint.lgAndUp" fixed class="elevation-3">
    <v-toolbar-side-icon @click.stop="toggleNavigationShowing"></v-toolbar-side-icon>
    <v-toolbar-title :style="titleStyle" class="ml-2 pl-1">
      <router-link style="text-decoration: none" class="hidden-sm-and-down ml-2 white--text" :to="{ name: 'Dashboard' }">
        KMS
      </router-link>
    </v-toolbar-title>

    <v-menu v-model="showFastSearching" offset-y min-width="500" attach=".toolbar-search-input">
      <v-text-field
        :value="searchQuery"
        @input="setQuery"
        flat
        solo-inverted
        slot="activator"
        prepend-icon="search"
        label="Search"
        style="min-width: 500px"
        class="hidden-sm-and-down toolbar-search-input"></v-text-field>

      <v-card>
        <v-list class="pb-1" :light="!darkTheme">
          <div v-if="!searchNotFound && !searchLoading">
            <v-list-tile avatar v-for="result in limitFive(searchResults)" :key="result.id">
              <v-list-tile-avatar class="mr-2" size="35" :color="result.avatar ? '' : 'grey'">
                <img v-if="result.avatar" :src="result.avatar" />
                <span v-else class="white--text headline">{{ result.name | firstLetterFilter }}</span>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>Tesla model 3 - <span class="grey--text">Project</span></v-list-tile-title>
                <v-list-tile-sub-title>
                  Short description on here...
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </div>

          <div v-if="searchNotFound && !searchLoading" class="text-xs-center">
            <h3 class="subheading mt-3 mb-3">Nothing found</h3>
          </div>

          <div v-if="!searchLoading && !searchLoaded" class="text-xs-center">
            <h3 class="subheading mt-3 mb-3">Enter search query to find what you need</h3>
          </div>

          <div v-if="searchLoading" class="text-xs-center mt-4">
            <v-progress-circular indeterminate :size="40" color="primary"></v-progress-circular>
          </div>

          <v-layout align-center class="pl-3">
            <span v-if="searchLoaded">Found {{ searchCount }} entries</span>
            <v-spacer></v-spacer>
            <v-btn flat small :light="!darkTheme" @click="setAdvansedSearching(true)">Advanced search</v-btn>
          </v-layout>
        </v-list>
      </v-card>
    </v-menu>

    <v-spacer></v-spacer>

    <v-btn icon @click="toggleNotifications" class="mr-4">
      <v-badge color="red">
        <span slot="badge" v-if="notificationsUnread > 0">{{ notificationsUnreadMsg }}</span>
        <v-icon>notifications</v-icon>
      </v-badge>
    </v-btn>
    <v-toolbar-items>
      <v-menu bottom offset-y left>
        <v-btn flat slot="activator">
          <v-avatar color="grey" size="40">v</v-avatar>
        </v-btn>
        <v-list>
          <v-list-tile :to="{ name: 'My-profile' }" exact><v-list-tile-title>Profile</v-list-tile-title></v-list-tile>
          <v-list-tile @click="toggleDarkTheme"><v-list-tile-title>Toggle theme</v-list-tile-title></v-list-tile>
          <v-list-tile @click="logout"><v-list-tile-title>Logout</v-list-tile-title></v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>

    <v-dialog
      :value="isSearchingAdvanced"
      @input="setAdvansedSearching($event)"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable>
      <v-card tile class="grey lighten-4">
        <v-toolbar card dark color="primary">
          <v-btn icon dark @click="setAdvansedSearching(false)">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Advanced search</v-toolbar-title>
        </v-toolbar>

        <v-container>
          <v-layout row wrap>
            <v-flex lg8 offset-lg2>
              <v-text-field
                prepend-icon="search"
                class="mb-3 elevation-1"
                solo
                clearable
                label="Type search request here..."
                :value="searchQuery"
                @input="setQuery"></v-text-field>

              <v-data-table
                search=""
                :headers="headers"
                :items="searchResults"
                :loading="searchLoading"
                :pagination.sync="pagination"
                :total-items="searchCount"
                :rows-per-page-items="rowsPerPageItems"
                class="elevation-1">
                <template slot="items" slot-scope="props">
                  <td>
                    <v-avatar class="mr-2" size="35" :color="props.item.avatar ? '' : 'grey'">
                      <img v-if="props.item.avatar" :src="props.item.avatar" />
                      <span v-else class="white--text headline">{{ props.item.name | firstLetterFilter }}</span>
                    </v-avatar>
                    <router-link @click.native="setAdvansedSearching(false)" v-if="props.item.type == RESULT_TYPE.DOCUMENT" :to="{ name: 'Document', params: { projectslug: props.item.parent_slug, documentslug: props.item.slug } }">{{ props.item.name }}</router-link>
                    <router-link @click.native="setAdvansedSearching(false)" v-if="props.item.type == RESULT_TYPE.PROJECT" :to="{ name: 'Project-intro', params: { projectslug: props.item.slug } }">{{ props.item.name }}</router-link>
                    <router-link @click.native="setAdvansedSearching(false)" v-if="props.item.type == RESULT_TYPE.USER" :to="{ name: 'Profile', params: { userId: props.item.id } }">{{ props.item.name }}</router-link>
                  </td>
                  <td>
                    <v-btn active-class="" flat small color="primary" @click.native="setAdvansedSearching(false)" v-if="props.item.type == RESULT_TYPE.DOCUMENT" :to="{ name: 'Document', params: { projectslug: props.item.parent_slug, documentslug: props.item.slug } }">View</v-btn>
                    <v-btn active-class="" flat small color="primary" @click.native="setAdvansedSearching(false)" v-if="props.item.type == RESULT_TYPE.PROJECT" :to="{ name: 'Project-intro', params: { projectslug: props.item.slug } }">View</v-btn>
                    <v-btn active-class="" flat small color="primary" @click.native="setAdvansedSearching(false)" v-if="props.item.type == RESULT_TYPE.USER" :to="{ name: 'Profile', params: { userId: props.item.id } }">View</v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-container>

        <div style="flex: 1 1 auto;"></div>
      </v-card>
    </v-dialog>
  </v-toolbar>
</template>
<script>
import _ from 'lodash'
import TextFiltersMixin from '@/mixins/filters/text'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

const RESULT_TYPE = {
  DOCUMENT: 'document',
  PROJECT: 'project',
  USER: 'user'
}

export default {
  name: 'kms-template-toolbar',
  mixins: [TextFiltersMixin],
  data: () => ({
    RESULT_TYPE,
    headers: [
      { text: 'Name', value: 'name', sortable: false },
      { text: 'Actions', value: 'actions', sortable: false, width: 200 }
    ],
    showFastSearching: false,
    rowsPerPageItems: [5, 10, 30, 50, 100],
    pagination: {
      rowsPerPage: 50
    }
  }),

  computed: {
    ...mapState({
      'notificationsUnread': s => s.Notifications.countUnread,
      'darkTheme': s => s.App.darkTheme,
      'navigationShowing': s => s.App.navigationShowing,

      'searchQuery': s => s.Searching.query,
      'searchResults': s => s.Searching.Engine.results,
      'searchCount': s => s.Searching.Engine.count,
      'searchLoading': s => s.Searching.Engine.loading,
      'searchLoaded': s => s.Searching.Engine.loaded,
      'isSearchingAdvanced': s => s.Searching.isSearchingAdvanced
    }),
    ...mapGetters({
      'notificationsUnreadMsg': 'Notifications/countUnread',

      'searchNotFound': 'Searching/Engine/isNotFound'
    }),
    toolbarColor () {
      return this.darkTheme ? '' : 'blue darken-3'
    },
    titleStyle () {
      return this.$vuetify.breakpoint.mdAndUp ? { width: '220px' } : {}
    }
  },

  watch: {
    searchQuery () {
      this.search()
    },
    pagination (value, oldValue) {
      if (value.rowsPerPage !== oldValue.rowsPerPage) {
        this.setLimit(value.rowsPerPage)
      }
      this.search(value.page)
    }
  },

  methods: {
    ...mapMutations({
      'toggleDarkTheme': 'App/toggleDarkTheme',
      'toggleNavigationShowing': 'App/toggleNavigationShowing',
      'toggleNotifications': 'Notifications/toggleShowing',

      'setQuery': 'Searching/setQuery',
      'setLimit': 'Searching/Engine/setLimit',
      'setAdvansedSearching': 'Searching/setAdvansedSearching'
    }),
    ...mapActions({
      'logoutAction': 'Account/logout',

      'search': 'Searching/run'
    }),

    limitFive (list) {
      return _.take(list, 5)
    },

    logout () {
      this.logoutAction().then(() => {
        this.$router.push({ name: 'Signin' })
      }).catch(() => {
        this.$router.push({ name: 'Signin' })
      })
    }
  }
}
</script>
