import { http } from './index'

export default {
  get: ({ id = null } = {}) => http.get('profile', { params: { id } })
}
