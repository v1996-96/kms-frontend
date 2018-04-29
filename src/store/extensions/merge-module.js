import _ from 'lodash'

export default (modules) => {
  if (!_.isArray(modules)) {
    return
  }

  var createState = () => _.map(modules, m => _.isFunction(m.state) ? m.state() : m.state)

  var merged = _.merge(..._.map(modules, m => _.omit(m, state)))

  merged.state = createState

  return merged
}
