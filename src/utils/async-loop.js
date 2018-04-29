import _ from 'lodash'
import async from 'async'

export default ({ fn = () => {}, delay = 500, stopOnError = false, err = () => {} }) => {
  var executeNext = true

  const start = () => {
    executeNext = true
    async.whilst(() => executeNext, (next) => {
      var returnValue = fn()

      if (_.has(returnValue, 'then') && _.has(returnValue, 'catch')) {
        returnValue.then((data) => {
          _.delay(next, delay, null)
          return data
        })

        if (stopOnError) {
          returnValue.catch((info) => {
            err(info)
            _.delay(next, delay, null)
            return info
          })
        }
      } else {
        _.delay(next, delay, null)
      }
    })
  }

  const stop = () => {
    executeNext = false
  }

  return { start, stop }
}
