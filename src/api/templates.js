import http from './http'

export default {
  getTypes: ({ limit, offset, query, project }) => http.get('templates/types', { params: { limit, offset, query, project } }),

  getList: ({ limit, offset, query, type, project }) => http.get('templates', { params: { limit, offset, query, type, project } }),

  getSingleByType: ({ type, project }) => http.get('templates/type/' + type, { params: { project } }),

  getSingle: ({ id, quill }) => http.get('templates/' + id, { params: { quill } }),

  create: (model) => http.post('templates', model),

  update: ({ id, model }) => http.put('templates/' + id, model),

  remove: ({ id }) => http.delete('templates/' + id),

  removeMultiple: ({ ids }) => http.delete('templates', { params: { ids } }),

  saveChanges: ({ id, model }) => http.post('templates/' + id + '/save', model)
}
