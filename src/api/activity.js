import http from './http'

export default {
  getList: ({ limit, offset, project }) => http.get('activity', { params: { limit, offset, project } })
}
