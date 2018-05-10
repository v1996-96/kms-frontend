var config = require('../config')
var path = require('path')
var connect = require('connect')
var serveStatic = require('serve-static')
var history = require('connect-history-api-fallback')

connect()
  .use(history())
  .use(serveStatic(config.build.assetsRoot))
  .listen(config.build.port, function () {
    console.log('Server running on ' + config.build.port);
  })
