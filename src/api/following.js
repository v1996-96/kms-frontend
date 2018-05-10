import http from './http'

export default {
  getList: ({ limit, offset, query }) => http.get('following', { params: { limit, offset, query } }),

  getByProject: ({ id }) => http.get('following/' + id),

  create: (model) => http.post('following', model),

  remove: ({ id }) => http.delete('following/' + id)
}
