import _ from 'lodash'

export default {
  filters: {
    firstLetterFilter (value) {
      return _.upperCase(_.defaultTo(value[0], ''))
    }
  }
}
