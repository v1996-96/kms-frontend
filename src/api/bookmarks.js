import http from './http'

export default {
  getList: ({ limit, offset, query }) => http.get('bookmarks', { params: { limit, offset, query } }),

  getByDocument: ({ id }) => http.get('bookmarks/' + id),

  create: (model) => http.post('bookmarks', model),

  remove: ({ id }) => http.delete('bookmarks/' + id)
}
