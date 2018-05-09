<template>
  <v-navigation-drawer app fixed :temporary="temporary" :clipped="true" :value="navigationShowing" @input="setNavigationShowing($event)" width="280">
    <template v-if="navigationType === 'common'">
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
        <v-list-tile :to="{ name: 'Users' }" exact>
          <v-list-tile-action><v-icon>people</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Users</v-list-tile-title></v-list-tile-content>
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

        <p v-if="myProjectsNotFound" class="text-xs-center mt-2">
          <v-btn outline color="primary" :to="{ name: 'Project-create' }" :active-class="''">Create project</v-btn>
        </p>

        <div v-if="!myProjectsLoaded && myProjectsLoading" class="text-xs-center">
          <v-progress-circular indeterminate :size="30" color="primary"></v-progress-circular>
        </div>

        <v-list-tile
          v-if="myProjectsLoaded" two-line avatar
          v-for="project in myProjects" :key="project.project_id"
          :to="{ name: 'Project-intro', params: { projectslug: project.slug } }">
          <v-list-tile-avatar size="38" :color="project.avatar ? '' : 'grey'">
            <img v-if="project.avatar" :src="project.avatar" />
            <span v-else class="white--text headline">{{ project.name | firstLetterFilter }}</span>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ project.name }}</v-list-tile-title>
            <v-list-tile-sub-title><small>{{ project.members_count }} members</small></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </template>

    <template v-if="navigationType === 'project'">
      <v-list dense>
        <v-list-tile class="pt-0 grey--text" :to="{ name: 'Projects' }">
          <v-list-tile-avatar>
            <v-icon>chevron_left</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Back to projects</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list v-if="selectedProject" class="pt-0">
        <v-list-tile two-line avatar :to="{ name: 'Project-intro' }" exact>
          <v-list-tile-avatar size="38" :color="selectedProject.avatar ? '' : 'grey'">
            <img v-if="selectedProject.avatar" :src="selectedProject.avatar" />
            <span v-else class="white--text headline">{{ selectedProject.name | firstLetterFilter }}</span>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ selectedProject.name }}</v-list-tile-title>
            <v-list-tile-sub-title><small>{{ selectedProject.members_count }} members</small></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list v-if="selectedProject.quick_links && selectedProject.quick_links.length == 0">
          <v-list-tile href="#">
            <v-list-tile-avatar>
              <v-icon>add</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Create quick link</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-list-group v-if="selectedProject.quick_links && selectedProject.quick_links.length > 0">
          <v-list-tile slot="activator">
            <v-list-tile-avatar>
              <v-icon>link</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Quick links</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile v-for="link in selectedProject.quick_links" :key="link.quick_link_id">
            <v-list-tile-content>
              <v-list-tile-title>{{ link.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>

        <v-list-tile :to="{ name: 'Project-settings', params: { projectslug: selectedProject.slug } }" exact>
          <v-list-tile-avatar>
            <v-icon>settings</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-divider></v-divider>

      <v-list dense>
        <v-subheader class="pr-0">
          Documents
          <v-spacer></v-spacer>
          <v-btn fab flat small class="mr-2">
            <v-icon>add</v-icon>
          </v-btn>
        </v-subheader>

        <v-list-tile href="#">
          <v-list-tile-content>
            <v-list-tile-title>
              <v-icon>chevron_left</v-icon>
              Back
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile href="#">
          <v-list-tile-content>
            <v-list-tile-title>Awesome document name that will blow your minds</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="#">
          <v-list-tile-content>
            <v-list-tile-title>Awesome document name that will blow your minds</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </template>
  </v-navigation-drawer>
</template>
<script>
import TextFilters from '@/mixins/filters/text'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'kms-template-navigation',
  mixins: [TextFilters],
  data: () => ({}),
  computed: {
    ...mapState({
      'navigationShowing': s => s.App.navigationShowing,

      'myProjectsLoading': s => s.MyProjects.List.loading,
      'myProjectsLoaded': s => s.MyProjects.List.loaded,
      'myProjects': s => s.MyProjects.List.results,

      'selectedProject': s => s.ProjectSingle.project
    }),
    ...mapGetters({
      'myProjectsNotFound': 'MyProjects/List/notFound'
    }),
    temporary () {
      return this.$route.meta && this.$route.meta.navigationHidden
    },
    navigationType () {
      return (this.$route && this.$route.meta && this.$route.meta.navigation) || 'common'
    }
  },
  watch: {
    '$route' (value, oldValue) {
      this.setNavigationShowing(!this.temporary)
    },
    navigationType (value) {
      if (value === 'common') {
        this.getMyProjects()
      }
    }
  },
  methods: {
    ...mapMutations({
      'setNavigationShowing': 'App/setNavigationShowing'
    }),
    ...mapActions({
      'getMyProjects': 'MyProjects/List/search',
      'myProjectsLoadMore': 'MyProjects/List/loadMore'
    })
  },
  created () {
    this.setNavigationShowing(!this.temporary)
  }
}
</script>
