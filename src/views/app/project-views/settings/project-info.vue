<template>
  <v-card v-if="project">
    <v-card-text>
      <v-form>
        <v-text-field
          @input="$v.project.name.$touch()"
          @blur="$v.project.name.$touch()"
          v-on:input="update('name', $event)"
          :error-messages="nameErrors"
          :counter="$v.project.name.$params.maxLength.max"
          :value="project.name"
          label="Project name"
          required></v-text-field>

        <v-text-field
          @input="$v.project.description.$touch()"
          @blur="$v.project.description.$touch()"
          v-on:input="update('description', $event)"
          :error-messages="descriptionErrors"
          :counter="$v.project.description.$params.maxLength.max"
          :value="project.description"
          label="Description"
          multi-line
          rows="3"></v-text-field>

        <v-text-field
          @input="$v.project.goal.$touch()"
          @blur="$v.project.goal.$touch()"
          v-on:input="update('goal', $event)"
          :error-messages="goalErrors"
          :counter="$v.project.goal.$params.maxLength.max"
          :value="project.goal"
          label="Main goal"></v-text-field>

        <!-- Dates -->
        <v-container fluid grid-list-lg class="pa-0">
          <v-layout row wrap>
            <v-flex lg6>
              <v-menu
                ref="startDateMenu"
                lazy
                :close-on-content-click="false"
                v-model="startDateMenu"
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                :return-value="project.date_start"
                @update:return-value="update('date_start', $event)">
                <v-text-field
                  slot="activator"
                  label="Start date"
                  :value="project.date_start"
                  @input="update('date_start', $event)"
                  v-on:input="$v.project.date_start.$touch()"
                  @blur="$v.project.date_start.$touch()"
                  :error-messages="startDateErrors"
                  clearable
                  readonly></v-text-field>
                <v-date-picker :value="project.date_start" @input="update('date_start', $event)" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.startDateMenu.save(project.date_start)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex lg6>
              <v-menu
                ref="endDateMenu"
                lazy
                :close-on-content-click="false"
                v-model="endDateMenu"
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                :return-value="project.date_end"
                @update:return-value="update('date_end', $event)">
                <v-text-field
                  slot="activator"
                  label="Finish date"
                  :value="project.date_end"
                  @input="update('date_end', $event)"
                  v-on:input="$v.project.date_end.$touch()"
                  @blur="$v.project.date_end.$touch()"
                  :error-messages="endDateErrors"
                  clearable
                  readonly></v-text-field>
                <v-date-picker :value="project.date_end" @input="update('date_end', $event)" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.endDateMenu.save(project.date_end)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-container>

        <v-text-field :value="project.avatar" @input="update('avatar', $event)" label="A place for project avatar"></v-text-field>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn depressed :disabled="!projectEdited" @click="discardChanges">Discard changes</v-btn>
      <v-btn color="primary" :disabled="!projectEdited" @click="saveChanges" :loading="isProjectSaving" depressed>Save changes</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import _ from 'lodash'
import moment from 'moment'
import { createNamespacedHelpers } from 'vuex'
import { required, maxLength, minLength } from 'vuelidate/lib/validators'

const { mapState, mapGetters, mapMutations, mapActions } = createNamespacedHelpers('ProjectSingle')

export default {
  name: 'kms-project-settings-info-tab',
  data: () => ({
    startDateMenu: null,
    endDateMenu: null
  }),
  computed: {
    ...mapState({
      'project': s => s.projectCache,
      'isProjectSaving': s => s.isProjectSaving
    }),
    ...mapGetters({
      'projectEdited': 'projectEdited'
    }),

    nameErrors () {
      const errors = []
      if (!this.project || !this.$v.project) return errors
      if (!this.$v.project.name.$dirty) return errors
      !this.$v.project.name.required && errors.push('You must specify project name')
      !this.$v.project.name.maxLength && errors.push('Project name is too long')
      !this.$v.project.name.minLength && errors.push('Project name must be at least 3 characters')
      return errors
    },
    descriptionErrors () {
      const errors = []
      if (!this.project || !this.$v.project) return errors
      if (!this.$v.project.description.$dirty) return errors
      !this.$v.project.description.maxLength && errors.push('Project description is too long')
      return errors
    },
    goalErrors () {
      const errors = []
      if (!this.project || !this.$v.project) return errors
      if (!this.$v.project.goal.$dirty) return errors
      !this.$v.project.goal.maxLength && errors.push('Project goal is too long')
      return errors
    },
    startDateErrors () {
      const errors = []
      if (!this.project || !this.$v.project) return errors
      if (!this.$v.project.date_start.$dirty) return errors
      !this.$v.project.date_start.valid && errors.push('Start date is invalid')
      return errors
    },
    endDateErrors () {
      const errors = []
      if (!this.project || !this.$v.project) return errors
      if (!this.$v.project.date_end.$dirty) return errors
      !this.$v.project.date_end.valid && errors.push('End date is invalid')
      !this.$v.project.date_end.sameOrAfter && errors.push('End date can`t be before start date')
      return errors
    }
  },

  validations () {
    return _.has(this.project, 'project_id') ? {
      project: {
        name: { required, maxLength: maxLength(100), minLength: minLength(3) },
        description: { maxLength: maxLength(1000) },
        goal: { maxLength: maxLength(100) },
        date_start: {
          valid: (value) => value ? moment(value).isValid() : true
        },
        date_end: {
          valid: (value) => value ? moment(value).isValid() : true,
          sameOrAfter: (value) => value ? moment(value).isSameOrAfter(_.defaultTo(this.project.date_start, value)) : true
        }
      }
    } : {}
  },

  methods: {
    ...mapMutations({
      'updateProjectCache': 'updateProjectCache',
      'discardChanges': 'discardChanges'
    }),
    ...mapActions({
      'saveChangesAction': 'saveChanges'
    }),

    update (field, value) {
      this.updateProjectCache({ field, value })
    },

    saveChanges () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }

      this.saveChangesAction()
    }
  }
}
</script>
