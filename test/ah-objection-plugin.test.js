/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
const fs = require('fs')
const path = require('path')
const { expect } = require('chai')
const ActionHero = require('actionhero')
const actionhero = new ActionHero.Process()

process.env.PROJECT_ROOT = path.join(require.resolve('actionhero'), '..')
const knexConfig = require(path.join(require.resolve('@zaephor-ah/ah-knex-plugin'), '..', 'config', 'ah-knex-plugin.js'))
const knexEnv = (process.env.NODE_ENV && knexConfig[process.env.NODE_ENV]) ? process.env.NODE_ENV : 'default'
let api

describe('ah-objection-plugin', () => {
  const configChanges = {
    'ah-knex-plugin': knexConfig[knexEnv]['ah-knex-plugin'](ActionHero.api),
    // 'ah-objection-plugin': config[environment]['ah-objection-plugin'](ActionHero.api),
    plugins: {
      'ah-knex-plugin': { path: path.join(require.resolve('@zaephor-ah/ah-knex-plugin'), '..') },
      'ah-objection-plugin': { path: path.join(__dirname, '..') }
    }
  }

  before(async () => {
    if (!fs.existsSync('./public')) { fs.mkdirSync('./public') }
    if (!fs.existsSync('./public/javascript')) { fs.mkdirSync('./public/javascript') }
    api = await actionhero.start({ configChanges })
  })

  after(async () => { await actionhero.stop() })

  it('ActionHero server launches', () => {
    expect(api.running).to.equal(true)
  })

  const scopes = ['knex', 'objection', 'models']
  for (const attribute of scopes) {
    it(attribute + ' should be in api scope', async () => {
      expect(api[attribute]).to.exist
    })
  }

  it('should validate that models can be detected')
  it('should validate that models can be loaded')
})
