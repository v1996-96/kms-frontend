import http from './http'

export default {
  signin: ({ email, password }) => http.post('auth/signin', { email, password }, { intercept: false }),

  signup: ({ token, model }) => http.post('auth/signup/' + token, model, { intercept: false }),

  refresh: ({ token }) => http.post('auth/refresh/' + token, null, { intercept: false }),

  revoke: ({ token }) => http.post('auth/revoke/' + token, null, { intercept: false }),

  revokeAll: ({ token }) => http.post('auth/revokeall/' + token, null, { intercept: false }),

  checkInvite: ({ token }) => http.get('auth/invite/' + token, { intercept: false })
}
