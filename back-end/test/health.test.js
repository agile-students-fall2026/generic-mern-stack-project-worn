import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'

describe('GET /api/health', () => {
  it('responds with status ok', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).to.equal(200)
    expect(response.body).to.deep.equal({ status: 'ok' })
  })
})
