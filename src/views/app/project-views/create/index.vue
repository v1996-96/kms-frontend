<template src="./template.html"></template>
<script>
import _ from 'lodash'
import Api from '@/api'
import moment from 'moment'
import uuid from 'uuid'
import ProjectModel from '@/models/project'
import { required, maxLength, minLength } from 'vuelidate/lib/validators'
import { TEAM_TABLE_HEADERS } from './config'
import UsersSearch from '@/components/active/users-search'
import ProjectRolesSearch from '@/components/active/project-roles-search'

export default {
  name: 'kms-app-project-create-page',
  components: {
    'kms-users-search': UsersSearch,
    'kms-project-roles-search': ProjectRolesSearch
  },
  data: () => ({
    TEAM_TABLE_HEADERS,
    isProjectCreating: false,
    tabs: null,

    name: '',
    description: '',
    goal: '',
    startDate: null,
    endDate: null,
    avatar: '',
    is_open: true,
    is_active: true,
    team: [],

    startDateMenu: null,
    endDateMenu: null,
    projectTeam: [],
    users: [
      { name: 'Joseph' },
      { name: 'Isaac' },
      { name: 'Newton' },
      { name: 'Albert' }
    ]
  }),

  validations () {
    return {
      name: { required, maxLength: maxLength(100), minLength: minLength(5) },
      description: { maxLength: maxLength(1000) },
      goal: { maxLength: maxLength(100) },
      startDate: {
        valid: (value) => value ? moment(value).isValid() : true
      },
      endDate: {
        valid: (value) => value ? moment(value).isValid() : true,
        sameOrAfter: (value) => value ? moment(value).isSameOrAfter(_.defaultTo(this.startDate, value)) : true
      }
    }
  },

  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('You must specify project name')
      !this.$v.name.maxLength && errors.push('Project name is too long')
      !this.$v.name.minLength && errors.push('Project name must be at least 5 characters')
      return errors
    },
    descriptionErrors () {
      const errors = []
      if (!this.$v.description.$dirty) return errors
      !this.$v.description.maxLength && errors.push('Project description is too long')
      return errors
    },
    goalErrors () {
      const errors = []
      if (!this.$v.goal.$dirty) return errors
      !this.$v.goal.maxLength && errors.push('Project goal is too long')
      return errors
    },
    startDateErrors () {
      const errors = []
      if (!this.$v.startDate.$dirty) return errors
      !this.$v.startDate.valid && errors.push('Start date is invalid')
      return errors
    },
    endDateErrors () {
      const errors = []
      if (!this.$v.endDate.$dirty) return errors
      !this.$v.endDate.valid && errors.push('End date is invalid')
      !this.$v.endDate.sameOrAfter && errors.push('End date can`t be before start date')
      return errors
    }
  },

  methods: {
    addTeamMember () {
      this.team.push({
        uid: uuid(),
        user: null,
        position: '',
        project_role: null
      })
    },
    removeTeamMember (member) {
      this.team = _.without(this.team, member)
    },

    create () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }

      this.isProjectCreating = true
      return Api.projects.create({
        'name': this.name,
        'description': this.description,
        'goal': this.goal,
        'date_start': this.startDate,
        'date_end': this.endDate,
        'avatar': this.avatar,
        'is_open': this.is_open,
        'is_active': this.is_active,
        'team': _.compact(_.map(this.team, (member) => member.user && member.role ? {
          user_id: member.user.user_id,
          position: member.position,
          project_role: member.role
        } : null))
      }).then((response) => {
        this.isProjectCreating = false
        var data = new ProjectModel(response.data)
        this.$notify.success('Project created successfully')
        this.$router.push({ name: 'Project-intro', params: { projectslug: data.slug } })
        return data.toJSON()
      }).catch(info => {
        this.isProjectCreating = false
        this.$notify.error('Error occured while creating project: ' + info.toString())
      })
    }
  }
}
</script>
