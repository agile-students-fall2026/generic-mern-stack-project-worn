const { expect } = require('chai')
const request = require('supertest')
const app = require('../app')
const users = require('../data/users')

function logIn(password = 'password123') {
  return request(app).post('/api/auth/login').send({ email: 'demo@worn.app', password })
}

describe('POST /api/profile/password', () => {
  let token

  beforeEach(async () => {
    users.resetUsers()
    token = (await logIn()).body.token
  })

  function changePassword(body, authToken = token) {
    return request(app)
      .post('/api/profile/password')
      .set('Authorization', `Bearer ${authToken}`)
      .send(body)
  }

  it('changes the password so only the new one logs in', async () => {
    const response = await changePassword({
      newPassword: 'brandnewpass',
      confirmPassword: 'brandnewpass',
    }).expect(200)

    expect(response.body.message).to.equal('Password updated.')
    await logIn('password123').expect(401)
    await logIn('brandnewpass').expect(200)
  })

  it('keeps the current session logged in', async () => {
    await changePassword({ newPassword: 'brandnewpass', confirmPassword: 'brandnewpass' })

    await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  it('logs out other sessions', async () => {
    const otherDeviceToken = (await logIn()).body.token

    await changePassword({ newPassword: 'brandnewpass', confirmPassword: 'brandnewpass' })

    await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${otherDeviceToken}`)
      .expect(401)
  })

  it('rejects a password shorter than 8 characters', async () => {
    const response = await changePassword({ newPassword: 'short', confirmPassword: 'short' })
      .expect(400)

    expect(response.body.message).to.equal('Use at least 8 characters.')
  })

  it('rejects passwords that do not match', async () => {
    const response = await changePassword({
      newPassword: 'brandnewpass',
      confirmPassword: 'differentpass',
    }).expect(400)

    expect(response.body.message).to.equal("Passwords don't match.")
    await logIn('password123').expect(200)
  })

  it('rejects a request with no token', async () => {
    await request(app)
      .post('/api/profile/password')
      .send({ newPassword: 'brandnewpass', confirmPassword: 'brandnewpass' })
      .expect(401)
  })
})
