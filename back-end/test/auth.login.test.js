const { expect } = require('chai')
const request = require('supertest')
const app = require('../app')
const users = require('../data/users')

describe('POST /api/auth/login', () => {
  beforeEach(() => users.resetUsers())

  it('logs in the demo account and returns the user with a token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'demo@worn.app', password: 'password123' })
      .expect(200)

    expect(response.body.user).to.include({ email: 'demo@worn.app', name: 'Demo User' })
    expect(response.body.user).to.not.have.property('passwordHash')
    expect(users.userForToken(response.body.token).email).to.equal('demo@worn.app')
  })

  it('ignores case and spaces in the email', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({ email: '  Demo@Worn.App ', password: 'password123' })
      .expect(200)
  })

  it('logs in an account created through sign up', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'jamie@example.com', password: 'longenough' })

    await request(app)
      .post('/api/auth/login')
      .send({ email: 'jamie@example.com', password: 'longenough' })
      .expect(200)
  })

  it('rejects a wrong password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'demo@worn.app', password: 'wrongpassword' })
      .expect(401)

    expect(response.body.message).to.equal('Email or password is incorrect.')
  })

  it('gives an unknown email the same answer as a wrong password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' })
      .expect(401)

    expect(response.body.message).to.equal('Email or password is incorrect.')
  })

  it('rejects missing fields', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'demo@worn.app' })
      .expect(400)

    expect(response.body.message).to.equal('Enter your email and password.')
  })
})
