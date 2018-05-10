import http from './http'

export default {
  // CRUD
  //
  getList: ({ limit, offset, query, my }) => http.get('projects', { params: { limit, offset, query, my } }),
  getSingle: ({ id }) => http.get('projects/' + id),
  create: (model) => http.post('projects', model),
  update: ({ id, model }) => http.put('projects/' + id, model),
  remove: ({ id }) => http.delete('projects/' + id),
  removeMultiple: ({ ids }) => http.delete('projects', { params: { ids } }),

  // Access
  //
  getPermissions: () => http.get('projects/permissions'),
  getRolesList: ({ limit, offset }) => http.get('projects/roles', { params: { limit, offset } }),
  getRole: ({ id }) => http.get('projects/roles/' + id),
  createRole: (model) => http.post('projects/roles', model),
  updateRole: ({ id, model }) => http.put('projects/roles/' + id, model),
  removeRole: ({ id }) => http.delete('projects/roles/' + id),
  removeMultipleRoles: ({ ids }) => http.delete('projects/roles', { params: { ids } }),

  // Team
  //
  getTeam: ({ id, limit, offset, query }) => http.get('projects/' + id + '/team', { params: { limit, offset, query } }),
  addTeamMember: ({ id, model }) => http.post('projects/' + id + '/team', model),
  updateTeamMember: ({ id, userId, model }) => http.put('projects/' + id + '/team/' + userId, model),
  removeTeamMember: ({ id, userId }) => http.delete('projects/' + id + '/team/' + userId),
  removeTeamMembersMultiple: ({ id, ids }) => http.delete('projects/' + id + '/team', { params: { ids } }),

  // Quick links
  //
  getQuickLinks: ({ id, limit, offset, query }) => http.get('projects/' + id + '/quick-links', { params: { limit, offset, query } }),
  addQuickLink: ({ id, model }) => http.post('projects/' + id + '/quick-links', model),
  updateQuickLink: ({ id, linkId, model }) => http.put('projects/' + id + '/quick-links/' + linkId, model),
  removeQuickLink: ({ id, linkId }) => http.delete('projects/' + id + '/quick-links/' + linkId),
  removeQuickLinksMultiple: ({ id, ids }) => http.delete('projects/' + id + '/quick-links', { params: { ids } })
}
