import { http } from './index'

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
  getComments: ({ id, limit, offset }) => http.get('projects/' + id + '/comments', { params: { limit, offset } }),
  addComment: ({ id, model }) => http.post('projects/' + id + '/comments', model),
  updateComment: ({ id, commentId, model }) => http.put('projects/' + id + '/comments/' + commentId, model),
  removeComment: ({ id, commentId }) => http.delete('projects/' + id + '/comments/' + commentId),
  removeCommentsMultiple: ({ id, ids }) => http.delete('projects/' + id + '/comments', { params: { ids } }),
  likeComment: ({ id, commentId }) => http.post('projects/' + id + '/comments/' + commentId),

  // Attachments
  //
  getAttachments: ({ id, limit, offset }) => http.get('projects/' + id + '/attachments', { params: { limit, offset } }),
  addAttachment: ({ id, model }) => http.post('projects/' + id + '/attachments', model),
  updateAttachment: ({ id, attachmentId, model }) => http.put('projects/' + id + '/attachments/' + attachmentId, model),
  removeAttachment: ({ id, attachmentId }) => http.delete('projects/' + id + '/attachments/' + attachmentId),
  removeAttachmentsMultiple: ({ id, ids }) => http.delete('projects/' + id + '/attachments', { params: { ids } })
}
