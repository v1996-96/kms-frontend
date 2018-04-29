import axios from 'axios'
import auth from './auth'

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

  auth
}
