import { http } from './index'

export default {
  getList: ({ limit, offset, query }) => http.get('following', { params: { limit, offset, query } }),

  create: (model) => http.post('following', model),

  remove: ({ id }) => http.delete('following', { params: { id } })
}
