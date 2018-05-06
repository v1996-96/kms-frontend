import { http } from './index'

export default {
  getList: ({ limit, offset, query }) => http.get('competences', { params: { limit, offset, query } }),

  getSingle: ({ id }) => http.get('competences/' + id),

  create: (model) => http.post('competences', model),

  update: ({ id, model }) => http.put('competences/' + id, model),

  remove: ({ id }) => http.delete('competences/' + id),

  removeMultiple: ({ ids }) => http.delete('competences', { params: { ids } })
}
