import http from './http'

export default {
  get: ({ id = null } = {}) => http.get('profile', { params: { id } })
}
