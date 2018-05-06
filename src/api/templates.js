import { http } from './index'

export default {
  getTypes: () => http.get('templates/types'),

  getList: ({ limit, offset, query }) => http.get('templates', { params: { limit, offset, query } }),

  getSingle: ({ id }) => http.get('templates/' + id),

  create: (model) => http.post('templates', model),

  update: ({ id, model }) => http.put('templates/' + id, model),

  remove: ({ id }) => http.delete('templates/' + id),

  removeMultiple: ({ ids }) => http.delete('templates', { params: { ids } }),

  saveChanges: ({ id, model }) => http.post('templates/' + id + '/save', model)
}
