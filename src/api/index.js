import axios from 'axios'
import auth from './auth'
import notifications from './notifications'
import activity from './activity'
import profile from './profile'
import bookmarks from './bookmarks'
import competences from './competences'
import documents from './documents'
import following from './following'
import lastseen from './lastseen'
import projects from './projects'
import settings from './settings'
import templates from './templates'
import users from './users'
import search from './search'

export const http = axios.create({
  baseURL: process.env.API_HOSTNAME
})

export default {
  setJWT (token) {
    http.defaults.headers.common['Authorization'] = 'Bearer ' + token
  },
  removeJWT () {
    delete http.defaults.headers.common['Authorization']
  },

  auth,
  notifications,
  activity,
  profile,
  bookmarks,
  competences,
  documents,
  following,
  lastseen,
  projects,
  settings,
  templates,
  users,
  search
}
