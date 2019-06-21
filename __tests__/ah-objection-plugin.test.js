/* eslint-env node, mocha */
const path = require('path')
const {expect} = require('chai')
const ActionHero = require('actionhero')
const actionhero = new ActionHero.Process()

process.env.PROJECT_ROOT = path.join(require.resolve('actionhero'), '..')
let knexConfig = require(path.join(require.resolve('@zaephor-ah/ah-knex-plugin'), '..', 'config', 'ah-knex-plugin.js'))
let knexEnv = (process.env.NODE_ENV && knexConfig[process.env.NODE_ENV]) ? process.env.NODE_ENV : 'default'
let api

describe('ah-objection-plugin', () => {
  let configChanges = {
    'ah-knex-plugin': knexConfig[knexEnv]['ah-knex-plugin'](ActionHero.api),
    // 'ah-objection-plugin': config[environment]['ah-objection-plugin'](ActionHero.api),
    plugins: {
      'ah-knex-plugin': {path: path.join(require.resolve('@zaephor-ah/ah-knex-plugin'), '..')},
      'ah-objection-plugin': {path: path.join(__dirname, '..')}
    }
  }

  before(async () => {
    api = await actionhero.start({configChanges})
  })

  after(async () => { await actionhero.stop() })

  it('ActionHero server launches', () => {
    expect(api.running).to.equal(true)
  })

  Array('knex', 'objection', 'models').forEach(function (attribute) {
    it(attribute + ' should be in api scope', async () => {
      expect(api[attribute]).to.exist
    })
  })

  it('should validate that migrations can be detected')
  it('should validate that migrations can be run')
})
