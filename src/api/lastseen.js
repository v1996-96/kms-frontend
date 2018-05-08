import { http } from './index'

export default {
  getList: ({ limit, offset, query }) => http.get('lastseen', { params: { limit, offset, query } }),

  create: (model) => http.post('lastseen', model),

  clear: () => http.delete('lastseen')
}
