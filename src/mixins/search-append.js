import _ from 'lodash'
export const ACTION_TYPE = { SET: 'set', APPEND: 'append' }
export const DEFAULT_LIMIT = 50
export const DEBOUNCE_TIME = 300
export const DEBOUNCE_OPTIONS = { maxWait: 300 }

export default ({
  namespace = 'search',
  model,
  endpoint,
  options = {},
  onError = () => {}
}) => {
  var ns = field => _.trim(namespace) + field
  var Model = model

  // Data fields
  const DATA_FILTERS = ns('Filters')
  const DATA_OFFSET = ns('Offset')
  const DATA_LIMIT = ns('Limit')
  const DATA_COUNT = ns('Count')
  const DATA_RESULTS = ns('Results')
  const DATA_LOADED = ns('Loaded')
  const DATA_LOADING = ns('Loading')

  const COMPUTED_SHOWING = ns('Showing')
  const COMPUTED_NOT_FOUND = ns('NotFound')
  const COMPUTED_CAN_LOAD_MORE = ns('CanLoadMore')

  const METHOD_RESET = ns('Reset')
  const METHOD_SEARCH_ACTION = ns('SearchAction')
  const METHOD_SEARCH = ns('Search')
  const METHOD_LOAD_MORE = ns('LoadMore')

  return {
    data: () => ({
      [DATA_FILTERS]: {},
      [DATA_OFFSET]: 0,
      [DATA_LIMIT]: DEFAULT_LIMIT,
      [DATA_COUNT]: 0,
      [DATA_RESULTS]: [],
      [DATA_LOADED]: false,
      [DATA_LOADING]: false
    }),

    computed: {
      [COMPUTED_SHOWING] () {
        return this[DATA_RESULTS].length
      },
      [COMPUTED_NOT_FOUND] () {
        return this[DATA_COUNT] === 0 && this[DATA_LOADED]
      },
      [COMPUTED_CAN_LOAD_MORE] () {
        return this[DATA_LOADED] && this[DATA_RESULTS].length < this[DATA_COUNT]
      }
    },

    methods: {
      [METHOD_RESET] () {
        this[DATA_FILTERS] = {}
        this[DATA_OFFSET] = 0
        this[DATA_COUNT] = 0
        this[DATA_RESULTS] = []
        this[DATA_LOADED] = false
        this[DATA_LOADING] = false
      },
      async [METHOD_SEARCH_ACTION] (filters = {}) {
        var actionType = ACTION_TYPE.SET

        if (_.isEqual(filters, this[DATA_FILTERS])) {
          this[DATA_OFFSET] = this[COMPUTED_SHOWING]
          actionType = ACTION_TYPE.APPEND
        } else {
          this[DATA_OFFSET] = 0
        }

        this[DATA_FILTERS] = filters

        if (_.isFunction(options)) {
          options = options()
        }

        var queryData = _.assign({}, options, this[DATA_FILTERS], {
          limit: this[DATA_LIMIT],
          offset: this[DATA_OFFSET]
        })

        var response = await endpoint(queryData)
        var dataModel = new Model(response.data)
        var data = dataModel.toJSON()

        this[DATA_COUNT] = data.count
        this[DATA_LOADED] = true

        if (actionType === ACTION_TYPE.APPEND) {
          this[DATA_RESULTS] = _.concat(this[DATA_RESULTS], data.results)
        } else if (actionType === ACTION_TYPE.SET) {
          this[DATA_RESULTS] = data.results
        }

        return data
      },
      [METHOD_SEARCH]: _.debounce(function (filters = {}) {
        this[DATA_LOADING] = true
        return this[METHOD_SEARCH_ACTION](filters).then((data) => {
          this[DATA_LOADING] = false
          return data
        }).catch((info) => {
          this[DATA_LOADING] = false
          onError.call(this, info)
          return info
        })
      }, DEBOUNCE_TIME, DEBOUNCE_OPTIONS),
      [METHOD_LOAD_MORE] () {
        return this[METHOD_SEARCH](this[DATA_FILTERS])
      }
    }
  }
}
