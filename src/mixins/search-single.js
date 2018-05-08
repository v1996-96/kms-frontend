import _ from 'lodash'

export default ({
  namespace = 'search',
  model,
  endpoint,
  options = {},
  onError = () => {}
}) => {
  var ns = field => _.trim(namespace) + field
  var Model = model

  const DATA_RESULT = ns('')
  const DATA_FILTERS = ns('Filters')
  const DATA_LOADED = ns('Loaded')
  const DATA_LOADING = ns('Loading')

  const COMPUTED_NOT_FOUND = ns('NotFound')

  const METHOD_RESET = ns('Reset')
  const METHOD_LOAD_ACTION = ns('LoadAction')
  const METHOD_LOAD = ns('Load')

  return {
    data: () => ({
      [DATA_FILTERS]: {},
      [DATA_RESULT]: [],
      [DATA_LOADED]: false,
      [DATA_LOADING]: false
    }),

    computed: {
      [COMPUTED_NOT_FOUND] () {
        return this[DATA_RESULT] === null && this[DATA_LOADED]
      }
    },

    methods: {
      [METHOD_RESET] () {
        this[DATA_FILTERS] = {}
        this[DATA_RESULT] = []
        this[DATA_LOADED] = false
        this[DATA_LOADING] = false
      },
      async [METHOD_LOAD_ACTION] (filters = {}) {
        this[DATA_FILTERS] = filters

        if (_.isFunction(options)) {
          options = options()
        }

        var queryData = _.assign({}, options, this[DATA_FILTERS])

        var response = await endpoint(queryData)
        var dataModel = new Model(response.data)
        this[DATA_LOADED] = true
        this[DATA_RESULT] = dataModel.toJSON()

        return this[DATA_RESULT]
      },
      [METHOD_LOAD] (filters = {}) {
        this[DATA_LOADING] = true
        return this[METHOD_LOAD_ACTION](filters).then((data) => {
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
