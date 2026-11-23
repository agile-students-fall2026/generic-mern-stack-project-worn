const { expect } = require('chai')
const request = require('supertest')
const app = require('../app')
const users = require('../data/users')

async function logInDemo() {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'demo@worn.app', password: 'password123' })
  return response.body.token
}

describe('Profile routes', () => {
  let token

  beforeEach(async () => {
    users.resetUsers()
    token = await logInDemo()
  })

  describe('GET /api/profile', () => {
    it('returns the logged-in user', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body.user).to.include({ name: 'Demo User', email: 'demo@worn.app' })
      expect(response.body.user).to.not.have.property('passwordHash')
    })

    it('rejects a request with no token', async () => {
      const response = await request(app).get('/api/profile').expect(401)
      expect(response.body.message).to.equal('Please log in again.')
    })

    it('rejects a token that does not exist', async () => {
      await request(app)
        .get('/api/profile')
        .set('Authorization', 'Bearer made-up-token')
        .expect(401)
    })

    it('rejects a header that is not a Bearer token', async () => {
      await request(app).get('/api/profile').set('Authorization', token).expect(401)
    })
  })

  describe('POST /api/auth/logout', () => {
    it('ends the session so the token stops working', async () => {
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
    })

    it('rejects a logout with no token', async () => {
      await request(app).post('/api/auth/logout').expect(401)
    })
  })

  describe('DELETE /api/profile', () => {
    it('deletes the account and logs it out', async () => {
      await request(app)
        .delete('/api/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(401)

      await request(app)
        .post('/api/auth/login')
        .send({ email: 'demo@worn.app', password: 'password123' })
        .expect(401)
    })

    it('frees the email so it can sign up again', async () => {
      await request(app)
        .delete('/api/profile')
        .set('Authorization', `Bearer ${token}`)

      await request(app)
        .post('/api/auth/signup')
        .send({ email: 'demo@worn.app', password: 'newpassword' })
        .expect(201)
    })

    it('rejects a delete with no token', async () => {
      await request(app).delete('/api/profile').expect(401)
    })
  })
})
