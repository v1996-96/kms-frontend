import State from 'ampersand-state'
import UserShortModel from '../user/short'

export default State.extend({
  props: {
    'comment_id': 'any',
    'content': 'string',
    'time_created': 'string',
    'likes_count': 'number'
  },
  children: {
    'user': UserShortModel
  }
})
