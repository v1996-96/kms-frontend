import http from './http'

export default {
  getPermissions: () => http.get('settings/permissions'),

  getRolesList: ({ limit, offset, query }) => http.get('settings/roles', { params: { limit, offset, query } }),

  getRole: ({ id }) => http.get('settings/roles/' + id),

  createRole: (model) => http.post('settings/roles', model),

  updateRole: ({ id, model }) => http.put('settings/roles/' + id, model),

  removeRole: ({ id }) => http.delete('settings/roles/' + id),

  removeMultipleRoles: ({ ids }) => http.delete('settings/roles', { params: { ids } })
}
