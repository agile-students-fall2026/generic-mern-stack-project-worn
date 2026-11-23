const { expect } = require('chai')
const request = require('supertest')
const app = require('../app')
const users = require('../data/users')

describe('POST /api/auth/signup', () => {
  beforeEach(() => users.resetUsers())

  it('creates an account and returns the user with a token', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'New@Example.com ', password: 'longenough' })
      .expect(201)

    expect(response.body.user).to.include({ email: 'new@example.com', name: 'new' })
    expect(response.body.user).to.not.have.property('passwordHash')
    expect(response.body.token).to.be.a('string').that.is.not.empty
  })

  it('lets the new account log straight in with its token', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'fresh@example.com', password: 'longenough' })

    expect(users.userForToken(response.body.token).email).to.equal('fresh@example.com')
  })

  it('rejects an invalid email', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'not-an-email', password: 'longenough' })
      .expect(400)

    expect(response.body.message).to.equal('Enter a valid email address.')
  })

  it('rejects a password shorter than 8 characters', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'short@example.com', password: 'short' })
      .expect(400)

    expect(response.body.message).to.equal('Use at least 8 characters.')
  })

  it('rejects a missing body', async () => {
    await request(app).post('/api/auth/signup').expect(400)
  })

  it('rejects an email that is already registered, ignoring case', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'DEMO@worn.app', password: 'longenough' })
      .expect(409)

    expect(response.body.message).to.equal('An account with that email already exists.')
  })
})
