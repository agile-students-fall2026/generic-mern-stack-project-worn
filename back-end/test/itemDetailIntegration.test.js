const { expect } = require('chai')

describe('Item detail frontend services with Express', () => {
  let server
  let services
  let originalFetch

  before(async () => {
    services = await import('../../front-end/src/services/closetService.js')
  })

  beforeEach(async () => {
    delete require.cache[require.resolve('../app')]
    const app = require('../app')
    server = app.listen(0, '127.0.0.1')
    await new Promise((resolve, reject) => {
      server.once('listening', resolve)
      server.once('error', reject)
    })
    originalFetch = globalThis.fetch
    const base = `http://127.0.0.1:${server.address().port}`
    globalThis.fetch = (url, options) => originalFetch(new URL(url, base), options)
  })

  afterEach(async () => {
    globalThis.fetch = originalFetch
    await new Promise(resolve => server.close(resolve))
  })

  it('retrieves an item and deletes an estimate through the frontend services', async () => {
    const item = await services.getItem('item-1')
    expect(item).to.include({ id: 'item-1', price: 68 })
    const response = await fetch('/api/items/item-1/bulk-log', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ count: 12 }),
    })
    const estimate = await response.json()
    expect(await services.deleteWear(estimate.id)).to.deep.equal({ id: estimate.id })
    const history = await fetch('/api/items/item-1/wears')
    expect(await history.json()).to.deep.equal([])
    expect(await services.getItem(item.id)).to.deep.equal(item)
  })

  it('rejects missing resources with server messages', async () => {
    for (const [action, message] of [
      [() => services.getItem('missing'), 'item not found'],
      [() => services.deleteWear('missing'), 'wear not found'],
    ]) {
      let error
      try { await action() } catch (caught) { error = caught }
      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.equal(message)
    }
  })
})
