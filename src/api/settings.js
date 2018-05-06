import { http } from './index'

export default {
  getPermissions: () => http.get('permissions'),

  getRolesList: ({ limit, offset }) => http.get('roles', { params: { limit, offset } }),

  getRole: ({ id }) => http.get('roles/' + id),

  createRole: (model) => http.post('roles', model),

  updateRole: ({ id, model }) => http.put('roles/' + id, model),

  removeRole: ({ id }) => http.delete('roles/' + id),

  removeMultipleRoles: ({ ids }) => http.delete('roles', { params: { ids } })
}
