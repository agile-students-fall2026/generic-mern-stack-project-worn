const { expect } = require('chai')
const request = require('supertest')
const fs = require('node:fs')
const path = require('node:path')
const app = require('../app')

describe('Static assets', () => {
  for (const file of ['images/item-placeholder.svg', 'images/default-avatar.svg', 'favicon.svg']) {
    it(`serves ${file} with its exact contents`, async () => {
      const response = await request(app)
        .get(`/static/${file}`)
        .buffer(true)
        .parse((res, callback) => {
          res.setEncoding('utf8')
          let body = ''
          res.on('data', chunk => { body += chunk })
          res.on('end', () => callback(null, body))
          res.on('error', callback)
        })
        .expect(200)
        .expect('Content-Type', /image\/svg\+xml/)

      const expected = fs.readFileSync(path.join(__dirname, '../public', file), 'utf8')
      expect(response.body).to.equal(expected)
    })
  }

  it('returns 404 for a missing asset', async () => {
    await request(app).get('/static/images/missing.svg').expect(404)
  })

  it('does not expose files outside public', async () => {
    await request(app).get('/static/%2e%2e%2fpackage.json').expect(404)
  })
})
