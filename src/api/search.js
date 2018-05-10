import http from './http'

export default {
  run: ({ limit, offset, query }) => http.get('search', { params: { limit, offset, query } })
}
