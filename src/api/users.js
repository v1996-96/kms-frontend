import http from './http'

export default {
  invite: ({ email }) => http.post('users/invite', { email }),

  getList: ({ limit, offset, query }) => http.get('users', { params: { limit, offset, query } }),

  getSingle: ({ id }) => http.get('users/' + id),

  update: ({ id, model }) => http.put('users/' + id, model),

  remove: ({ id }) => http.delete('users/' + id),

  removeMultiple: ({ ids }) => http.delete('users', { params: { ids } })
}
