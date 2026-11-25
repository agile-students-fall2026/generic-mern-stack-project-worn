const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai

chai.use(chaiHttp)

describe('Item detail routes', () => {
  let app

  beforeEach(() => {
    // Give each test fresh in-memory items and wears.
    delete require.cache[require.resolve('../app')]
    app = require('../app')
  })

  it('returns an item without changing it', async () => {
    const first = await chai.request(app).get('/api/items/item-1')
    const second = await chai.request(app).get('/api/items/item-1')
    expect(first).to.have.status(200)
    expect(first).to.be.json
    expect(first.body).to.include({ id: 'item-1', price: 68 })
    expect(second.body).to.deep.equal(first.body)
  })

  it('returns a JSON 404 message for a missing item', async () => {
    const response = await chai.request(app).get('/api/items/missing')
    expect(response).to.have.status(404)
    expect(response.body).to.deep.equal({ message: 'item not found' })
  })

  it('removes an entire estimate while preserving other wears and the item', async () => {
    const selected = await chai.request(app).post('/api/items/item-1/bulk-log').send({ count: 12 })
    const sameItem = await chai.request(app).post('/api/items/item-1/bulk-log').send({ count: 3 })
    const otherItem = await chai.request(app).post('/api/items/item-2/bulk-log').send({ count: 7 })

    const removed = await chai.request(app).delete(`/api/wears/${selected.body.id}`)
    expect(removed).to.have.status(200)
    expect(removed.body).to.deep.equal({ id: selected.body.id })
    const history = await chai.request(app).get('/api/items/item-1/wears')
    expect(history.body).to.deep.equal([sameItem.body])
    const otherHistory = await chai.request(app).get('/api/items/item-2/wears')
    expect(otherHistory.body).to.deep.equal([otherItem.body])
    const item = await chai.request(app).get('/api/items/item-1')
    expect(item).to.have.status(200)

    const repeated = await chai.request(app).delete(`/api/wears/${selected.body.id}`)
    expect(repeated).to.have.status(404)
    expect(repeated.body).to.deep.equal({ message: 'wear not found' })
  })

  it('leaves an empty history after deleting the last wear', async () => {
    const wear = await chai.request(app).post('/api/items/item-1/bulk-log').send({ count: 5 })
    await chai.request(app).delete(`/api/wears/${wear.body.id}`)
    const history = await chai.request(app).get('/api/items/item-1/wears')
    expect(history.body).to.deep.equal([])
  })

  it('does not change history when the wear ID is missing', async () => {
    const wear = await chai.request(app).post('/api/items/item-1/bulk-log').send({ count: 5 })
    const response = await chai.request(app).delete('/api/wears/missing')
    expect(response).to.have.status(404)
    expect(response.body).to.deep.equal({ message: 'wear not found' })
    const history = await chai.request(app).get('/api/items/item-1/wears')
    expect(history.body).to.deep.equal([wear.body])
  })
})
