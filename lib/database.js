'use strict'

const mongoose      = require('mongoose')
require('bluebird').promisifyAll(mongoose)

function bootstrap(mongoOptions) {
  return new Promise((resolve) => {
    let mongoUri  = mongoOptions.uri
    let mongoOpts = mongoOptions.options || {}
    mongoose.connection.once('open', function() {
      if (!mongoOpts.quiet) {
        console.log('Mongoose connected to ' + mongoUri)
      }
      resolve()
    })
    mongoose.connection.on('error', function(err) {
      console.error('Mongoose connection error: ' + err)
    })

    mongoose.connect(mongoUri, mongoOpts)
  })
}

function shutdown() {
  return new Promise((resolve) => {
    mongoose.connection.removeAllListeners()
    mongoose.connection.close(resolve)
  })
}

exports.bootstrap = bootstrap
exports.shutdown  = shutdown
