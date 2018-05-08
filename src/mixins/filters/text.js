import _ from 'lodash'

export default {
  filters: {
    firstLetterFilter (value) {
      return _.upperCase(_.defaultTo(_.trim(value)[0], ''))
    },
    textLimitFilter (value, limit) {
      return value.length > limit ? _.join(_.take(value, limit), '') + '...' : value
    }
  }
}
