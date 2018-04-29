import { http } from './index'

export default {
  getList: ({ limit, offset }) => http.get('activity', { params: { limit, offset } })
}
