import _ from 'lodash'
import http from './http'
import join from 'join-path'

export default {
  // CRUD
  //
  getList: ({ limit, offset, query, isDraft, root, children }) => http.get('documents', { params: { limit, offset, query, isDraft, root, children } }),
  getSingle: ({ id, quill }) => http.get('documents/' + id, { params: { quill } }),
  create: (model) => http.post('documents', model),
  update: ({ id, model }) => http.put('documents/' + id, model),
  remove: ({ id }) => http.delete('documents/' + id),
  removeMultiple: ({ ids }) => http.delete('documents', { params: { ids } }),
  like: ({ id }) => http.post('documents/' + id + '/like'),
  saveChanges: ({ id, model }) => http.post('documents/' + id + '/save', model),

  // Comments
  //
  getComments: ({ id, limit, offset }) => http.get('documents/' + id + '/comments', { params: { limit, offset } }),
  addComment: ({ id, model }) => http.post('documents/' + id + '/comments', model),
  updateComment: ({ id, commentId, model }) => http.put('documents/' + id + '/comments/' + commentId, model),
  removeComment: ({ id, commentId }) => http.delete('documents/' + id + '/comments/' + commentId),
  removeCommentsMultiple: ({ id, ids }) => http.delete('documents/' + id + '/comments', { params: { ids } }),
  likeComment: ({ id, commentId }) => http.post('documents/' + id + '/comments/' + commentId),

  // Attachments
  //
  getAttachments: ({ id, limit, offset, query }) => http.get('documents/' + id + '/attachments', { params: { limit, offset, query } }),
  addAttachment: ({ id, model }) => http.post('documents/' + id + '/attachments', model),
  updateAttachment: ({ id, attachmentId, model }) => http.put('documents/' + id + '/attachments/' + attachmentId, model),
  removeAttachment: ({ id, attachmentId }) => http.delete('documents/' + id + '/attachments/' + attachmentId),
  removeAttachmentsMultiple: ({ id, ids }) => http.delete('documents/' + id + '/attachments', { params: { ids } }),

  attachmentsEndpoint: ({ id }) => join(process.env.API_HOSTNAME, 'documents/' + id + '/attachments'),
  attachmentsHeaders: () => _.assign({}, http.defaults.headers.common)
}
