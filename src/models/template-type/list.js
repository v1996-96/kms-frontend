import Collection from 'ampersand-collection'
import State from 'ampersand-state'
import PermissionModel from './index'

export default State.extend({
  collections: {
    permissions: Collection.extend({ model: PermissionModel })
  }
})
