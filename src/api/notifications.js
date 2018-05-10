import http from './http'

export default {
  getList: ({ limit, offset }) => http.get('notifications', { params: { limit, offset } }),

  read: () => http.post('notifications/read'),

  clear: () => http.delete('notifications')
}
