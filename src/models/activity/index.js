import State from 'ampersand-state'
import UserShortModel from '@/models/user/short'

export default State.extend({
  props: {
    'activity_id': 'any',
    'content': 'string',
    'time_fired': 'string',
    'meta': 'string',
    'project_name': 'string',
    'project_slug': 'string',
    'project_id': 'any'
  },
  children: {
    'issuer': UserShortModel
  }
})
