<template>
  <v-card>
    <v-card-text>
      <h4 class="subheading mb-4">Roles management</h4>

      <v-divider class="mt-2 mb-2"></v-divider>

      <p class="error--text mb-0">
        While deleting project, you will delete all assigned documents. You will not be able to rollback. <br>

        <v-dialog v-model="deletionDialog" max-width="400">
          <v-btn slot="activator" color="error" class="ml-0">Delete project</v-btn>
          <v-card>
            <v-card-title class="headline">Are you sure?</v-card-title>
            <v-card-text>
              <p>
                You will not be able to restore deleted project. <br>
                In order to completely delete project enter project name in the field below: <code>{{ project.name }}</code>
              </p>

              <v-text-field v-model="deletionProjectName" solo label="Project name"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn flat @click="cancelDeletion">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="error" v-if="!deletionAgreed" @click="deletionAgreed = true">Agree</v-btn>
              <v-btn color="error" v-if="deletionAgreed" @click="deleteProject" :disabled="isProjectDeleting" :loading="isProjectDeleting">Delete project</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </p>
    </v-card-text>
  </v-card>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('ProjectSingle')

export default {
  name: 'kms-project-settings-documents-tab',
  data: () => ({
    deletionDialog: null,
    deletionProjectName: '',
    deletionAgreed: false
  }),
  computed: {
    ...mapState({
      'project': s => s.project,
      'isProjectDeleting': s => s.isProjectDeleting
    })
  },

  methods: {
    ...mapActions({
      'deleteProjectAction': 'deleteProject'
    }),

    cancelDeletion () {
      this.deletionDialog = false
      this.deletionAgreed = false
      this.deletionProjectName = ''
    },

    deleteProject () {
      this.deleteProjectAction().then(() => {
        this.cancelDeletion()
        this.$router.push({ name: 'Projects' })
      }).catch(info => {
        this.$notify.error('Error occured while deleting project')
        this.deletionAgreed = false
        this.deletionProjectName = ''
      })
    }
  }
}
</script>
