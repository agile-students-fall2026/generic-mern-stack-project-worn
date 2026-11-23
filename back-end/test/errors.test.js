import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'
import { errorHandler } from '../middleware/errors.js'

function mockResponse() {
  return {
    headersSent: false,
    status(code) {
      this.statusCode = code
      return this
    },
    json(body) {
      this.body = body
      return this
    },
  }
}

describe('error handling', () => {
  it('returns a JSON 404 for unknown /api routes', async () => {
    const response = await request(app).get('/api/does-not-exist')

    expect(response.status).to.equal(404)
    expect(response.body).to.deep.equal({ message: 'No API route for GET /api/does-not-exist' })
  })

  it('returns a JSON 400 for a malformed JSON body', async () => {
    const response = await request(app)
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send('{ not json')

    expect(response.status).to.equal(400)
    expect(response.body).to.have.property('message').that.is.a('string')
  })

  it('hides internal details on server errors', () => {
    const originalConsoleError = console.error
    console.error = () => {}
    const res = mockResponse()

    try {
      errorHandler(new Error('database password is hunter2'), {}, res, () => {})
    } finally {
      console.error = originalConsoleError
    }

    expect(res.statusCode).to.equal(500)
    expect(res.body).to.deep.equal({ message: 'Something went wrong on the server' })
  })

  it('passes the error on when the response has already started', () => {
    const res = { ...mockResponse(), headersSent: true }
    const error = new Error('late failure')
    let passedError

    errorHandler(error, {}, res, (err) => {
      passedError = err
    })

    expect(passedError).to.equal(error)
  })
})
