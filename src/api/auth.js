import { http } from './index'

export default {
  signin: ({ email, password }) => http.post('auth/signin', { email, password }),

  signup: (model) => http.post('auth/signup', model),

  refresh: ({ token }) => http.post('auth/refresh/' + token),

  revoke: ({ token }) => http.post('auth/revoke/' + token),

  revokeAll: ({ token }) => http.post('auth/revokeall/' + token)
}
