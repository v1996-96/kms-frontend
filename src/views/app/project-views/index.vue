<template>
  <div>
    <router-view v-if="!isProjectLoading && project"></router-view>

    <div v-if="isProjectLoading" class="text-xs-center mt-4">
      <v-progress-circular indeterminate :size="50" color="primary"></v-progress-circular>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'sa-page-projects',
  props: {
    'projectslug': String
  },
  computed: {
    ...mapState({
      'isProjectLoading': s => s.ProjectSingle.isProjectLoading,
      'project': s => s.ProjectSingle.project
    })
  },
  watch: {
    projectslug () {
      this.fetch(this.projectslug)
    },
    'project.slug' (value) {
      this.$router.replace({
        name: this.$route.name,
        params: _.assign({}, this.$route.params, { projectslug: value })
      })
    }
  },
  methods: {
    ...mapActions({
      'fetch': 'ProjectSingle/fetch'
    })
  },
  created () {
    this.fetch(this.projectslug)
  }
}
</script>
