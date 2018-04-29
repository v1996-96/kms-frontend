import axios from 'axios'
import auth from './auth'
import notifications from './notifications'
import activity from './activity'
import profile from './profile'

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
  profile
}
