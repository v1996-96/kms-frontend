import _ from 'lodash'
export const DEFAULT_LIMIT = 100

export default ({
  namespace = 'search',
  model,
  endpoint,
  searchOptions = {},
  onError = () => {}
}) => {
  var ns = field => _.trim(namespace) + field
  var Model = model

  const DATA_FILTERS = ns('Filters')
  const DATA_OFFSET = ns('Offset')
  const DATA_COUNT = ns('Count')
  const DATA_RESULTS = ns('Results')
  const DATA_LOADED = ns('Loaded')
  const DATA_LOADING = ns('Loading')

  const COMPUTED_SHOWING = ns('Showing')
  const COMPUTED_IS_NOT_FOUND = ns('IsNotFound')

  const METHOD_RESET = ns('Reset')
  const METHOD_SEARCH_ACTION = ns('SearchAction')
  const METHOD_SEARCH = ns('Search')
  const METHOD_LOADATA_MORE = ns('LoadMore')

  return {
    data: () => ({
      [DATA_FILTERS]: {},
      [DATA_OFFSET]: 0,
      [DATA_COUNT]: 0,
      [DATA_RESULTS]: [],
      [DATA_LOADED]: false,
      [DATA_LOADING]: false
    }),

    computed: {
      [COMPUTED_SHOWING] () {
        return this[DATA_RESULTS].length
      },
      [COMPUTED_IS_NOT_FOUND] () {
        return this[DATA_COUNT] === 0 && this[DATA_LOADED]
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
        this[DATA_FILTERS] = filters

        if (_.isFunction(searchOptions)) {
          searchOptions = searchOptions()
        }

        var queryData = _.assign({}, searchOptions, this[DATA_FILTERS], {
          limit: DEFAULT_LIMIT,
          offset: this[DATA_OFFSET]
        })

        var response = await endpoint(queryData)
        var dataModel = new Model(response.data)
        var data = dataModel.toJSON()

        this[DATA_COUNT] = data.count
        this[DATA_LOADED] = true
        this[DATA_RESULTS] = data.results

        return data
      },
      [METHOD_SEARCH] (filters = {}) {
        this[DATA_LOADING] = true
        return this[METHOD_SEARCH_ACTION](filters).then((data) => {
          this[DATA_LOADING] = false
          return data
        }).catch((info) => {
          this[DATA_LOADING] = false
          onError.call(this, info)
          return info
        })
      }
    }
  }
}
