/* eslint-env node, mocha */
const path = require('path')

process.env.PROJECT_ROOT = path.join(__dirname, '..', 'node_modules', 'actionhero')

const ActionHero = require('actionhero')
const actionhero = new ActionHero.Process()
let api

describe('ah-objection-plugin', () => {
  before(async () => {
    let configChanges = {
      'ah-objection-plugin': { },
      plugins: {
        'ah-objection-plugin': { path: path.join(__dirname, '..') }
      }
    }
    api = await actionhero.start({ configChanges })
  })

  after(async () => { await actionhero.stop() })
})
