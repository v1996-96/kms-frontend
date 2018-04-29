import State from 'ampersand-state'
import ProfileShortModel from '@/models/profile/short'

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
    'issuer': ProfileShortModel
  }
})
