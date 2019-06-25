'use strict'
const { Initializer, api } = require('actionhero')
const path = require('path')
const glob = require('glob')
const { Model } = require('objection')

module.exports = class ObjectionInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'ah-objection-plugin'
    this.loadPriority = 1001
    this.startPriority = 1001
    this.stopPriority = 1001
  }

  async initialize () {
    api.models = {}
    api.objection = {
      Model: Model
    }
    api.log('[' + this.loadPriority + '] ' + this.name + ': Initializing')

    // TODO: Throw an error when api.knex isn't loaded
    api.objection.Model.knex(api.knex)

    api.objection.loadFile = async (fileType, file) => {
      // console.log({ fileType, file })
      if (fileType === 'models') {
        let tmpModel = require(path.resolve(file))(api.objection.Model)
        if (api[fileType][tmpModel.tableName]) { throw new Error('[' + this.name + '] The model "' + tmpModel.tableName + '" in ' + file + ' was already defined.') }
        api[fileType][tmpModel.tableName] = tmpModel
      }
    }

    for (let pluginName in api.config.plugins) {
      if (api.config.plugins[pluginName].models !== false) {
        let pluginPath = api.config.plugins[pluginName].path
        let files = glob.sync(path.join(pluginPath, 'models', '**', '*.js'))
        for (let j in files) { await api.objection.loadFile('models', files[j]) }
      }
    }
  }
}
