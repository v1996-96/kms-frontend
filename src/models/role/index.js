import Collection from 'ampersand-collection'
import State from 'ampersand-state'

import PermissionModel from '../permission'

export default State.extend({
  props: {
    'role_id': 'any',
    'name': 'string',
    'system': 'boolean'
  },
  collections: {
    'permissions': Collection.extend({ model: PermissionModel })
  }
})
