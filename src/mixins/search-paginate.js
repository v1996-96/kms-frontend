import _ from 'lodash'
export const LOADATA_DIRECTION = {
  FORWARD: 'forward',
  BACKWARD: 'backward'
}
export const LIMIT_DEFAULT = 30
export const DEBOUNCE_TIME = 100
export const DEBOUNCE_OPTIONS = {
  maxWait: 300
}

export default ({
  namespace = 'model',
  model,
  endpoint,
  options = {},
  onError = () => {}
}) => {
  var ns = field => _.trim(namespace) + field
  var Model = model

  const DATA_FILTERS = ns('Filters')
  const DATA_LIMIT = ns('Limit')
  const DATA_PAGE = ns('Page')
  const DATA_COUNT = ns('Count')
  const DATA_RESULTS = ns('Results')
  const DATA_LOADED = ns('Loaded')
  const DATA_LOADING = ns('Loading')

  const COMPUTED_SHOWING = ns('Showing')
  const COMPUTED_OFFSET = ns('Offset')
  const COMPUTED_TOTAL_PAGES = ns('TotalPages')
  const COMPUTED_IS_NOT_FOUND = ns('IsNotFound')
  const COMPUTED_FORWARDATA_AVAILABLE = ns('ForwardAvailable')
  const COMPUTED_BACKWARDATA_AVAILABLE = ns('BackwardAvailable')

  const METHOD_RESET = ns('Reset')
  const METHOD_CLEAR_FILTERS = ns('ClearFilters')
  const METHOD_SET_LIMIT = ns('SetLimit')
  const METHOD_SET_FORWARD = ns('SetForwardLoading')
  const METHOD_SET_BACKWARD = ns('SetBackwardLoading')
  const METHOD_SEARCH_ACTION = ns('SearchAction')
  const METHOD_SEARCH = ns('Search')
  const METHOD_RELOAD = ns('Reload')

  return {
    data: () => ({
      [DATA_FILTERS]: {},
      [DATA_LIMIT]: LIMIT_DEFAULT,
      [DATA_PAGE]: 1,
      [DATA_COUNT]: 0,
      [DATA_RESULTS]: [],
      [DATA_LOADED]: false,
      [DATA_LOADING]: false
    }),

    computed: {
      [COMPUTED_SHOWING] () {
        return this[DATA_RESULTS].length
      },
      [COMPUTED_OFFSET] () {
        return this[DATA_LIMIT] * (this[DATA_PAGE] - 1)
      },
      [COMPUTED_TOTAL_PAGES] () {
        return Math.ceil(this[DATA_COUNT] / this[DATA_LIMIT])
      },
      [COMPUTED_IS_NOT_FOUND] () {
        return this[DATA_LOADED] && this[DATA_COUNT] === 0
      },
      [COMPUTED_FORWARDATA_AVAILABLE] () {
        return this[DATA_PAGE] < this[COMPUTED_TOTAL_PAGES]
      },
      [COMPUTED_BACKWARDATA_AVAILABLE] () {
        return this[DATA_PAGE] > 1
      }
    },

    watch: {
      [DATA_LIMIT] (limit) {
        this[METHOD_SET_LIMIT](limit)
        this[METHOD_RELOAD]()
      }
    },

    methods: {
      [METHOD_RESET] () {
        this[DATA_FILTERS] = {}
        this[DATA_LIMIT] = LIMIT_DEFAULT
        this[DATA_PAGE] = 1
        this[DATA_COUNT] = 0
        this[DATA_RESULTS] = []
        this[DATA_LOADED] = false
        this[DATA_LOADING] = false
      },
      [METHOD_CLEAR_FILTERS] () {
        this[DATA_FILTERS] = {}
      },
      [METHOD_SET_FORWARD] () {
        if (this[DATA_PAGE] < this[COMPUTED_TOTAL_PAGES]) {
          this[DATA_PAGE] = this[DATA_PAGE] + 1
        }
      },
      [METHOD_SET_BACKWARD] () {
        if (this[DATA_PAGE] > 1) {
          this[DATA_PAGE] = this[DATA_PAGE] - 1
        }
      },
      [METHOD_SET_LIMIT] (limit) {
        this[DATA_LIMIT] = _.toNumber(limit)
      },
      async [METHOD_SEARCH_ACTION] ({ filters = {}, direction = null, page = null } = {}) {
        this[DATA_RESULTS] = []

        if (!_.isEqual(this[DATA_FILTERS], filters)) {
          this[METHOD_RESET]
          this[DATA_FILTERS] = filters
        }

        if (page !== null && _.isNumber(page)) {
          this[DATA_PAGE] = page
        } else if (direction !== null) {
          switch (direction) {
            case LOADATA_DIRECTION.FORWARD:
              this[METHOD_SET_FORWARD]()
              break

            case LOADATA_DIRECTION.BACKWARD:
              this[METHOD_SET_BACKWARD]()
              break
          }
        }

        if (_.isFunction(options)) {
          options = options()
        }

        var queryData = _.assign({}, options, this[DATA_FILTERS], {
          limit: this[DATA_LIMIT],
          offset: this[COMPUTED_OFFSET]
        })

        var response = await endpoint(queryData)
        var dataModel = new Model(response.data)
        var data = dataModel.toJSON()

        this[DATA_COUNT] = data.count
        this[DATA_RESULTS] = data.results
        this[DATA_LOADED] = true

        if (data.count > 0 && data.results.length === 0 && this[DATA_PAGE] > this[COMPUTED_TOTAL_PAGES]) {
          data = await this[METHOD_SEARCH]({
            filters: this[DATA_FILTERS],
            page: this[COMPUTED_TOTAL_PAGES]
          })
        }

        return data
      },
      [METHOD_SEARCH]: _.debounce(function ({ filters = {}, direction = null, page = null } = {}) {
        this[DATA_LOADING] = true
        return this[METHOD_SEARCH_ACTION]({ filters, direction, page }).then((data) => {
          this[DATA_LOADING] = false
          return data
        }).catch((info) => {
          this[DATA_LOADING] = false
          onError.call(this, info)
          return info
        })
      }, DEBOUNCE_TIME, DEBOUNCE_OPTIONS),
      [METHOD_RELOAD] () {
        return this[METHOD_SEARCH]({ filters: this[DATA_FILTERS] })
      }
    }
  }
}
