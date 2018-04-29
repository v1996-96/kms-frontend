import Collection from 'ampersand-collection'
import State from 'ampersand-state'

export default (Model) => State.extend({
  props: {
    count: 'number'
  },
  collections: {
    results: Collection.extend({
      model: Model
    })
  }
})
