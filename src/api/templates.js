import { http } from './index'

export default {
  getTypes: () => http.get('templates/types'),

  getList: ({ limit, offset, query, type }) => http.get('templates', { params: { limit, offset, query, type } }),

  getSingleByType: ({ type }) => http.get('templates/type/' + type),

  getSingle: ({ id, quill }) => http.get('templates/' + id, { params: { quill } }),

  create: (model) => http.post('templates', model),

  update: ({ id, model }) => http.put('templates/' + id, model),

  remove: ({ id }) => http.delete('templates/' + id),

  removeMultiple: ({ ids }) => http.delete('templates', { params: { ids } }),

  saveChanges: ({ id, model }) => http.post('templates/' + id + '/save', model)
}
