import { expect } from 'chai'
import { itemStore, wearStore, getCategories } from '../data/store.js'

describe('mock data store', () => {
  beforeEach(() => {
    itemStore.reset()
    wearStore.reset()
  })

  it('returns the seeded categories, items and wears', () => {
    expect(getCategories()).to.deep.equal(['Tops', 'Bottoms', 'Shoes', 'Outerwear'])
    expect(itemStore.getAll()).to.have.lengthOf(13)
    expect(wearStore.getAll()).to.not.be.empty
  })

  it('gets a single record by id, or null when missing', () => {
    expect(itemStore.getById('item-1').name).to.equal('White oxford shirt')
    expect(itemStore.getById('item-999')).to.equal(null)
  })

  it('adds a record with a new unique id', () => {
    const added = itemStore.add({ name: 'Wool scarf', category: 'Outerwear', price: 40 })

    expect(added.id).to.equal('item-14')
    expect(itemStore.getById('item-14')).to.deep.equal(added)
    expect(itemStore.add({ name: 'Second scarf' }).id).to.equal('item-15')
  })

  it('updates a record without letting the id change', () => {
    const updated = itemStore.update('item-1', { price: 70, id: 'item-hacked' })

    expect(updated).to.include({ id: 'item-1', price: 70, name: 'White oxford shirt' })
    expect(itemStore.getById('item-1').price).to.equal(70)
    expect(itemStore.update('item-999', { price: 1 })).to.equal(null)
  })

  it('deletes a record and returns it, or null when missing', () => {
    expect(itemStore.remove('item-1').id).to.equal('item-1')
    expect(itemStore.getById('item-1')).to.equal(null)
    expect(itemStore.remove('item-1')).to.equal(null)
  })

  it('returns copies so callers cannot change stored data by accident', () => {
    itemStore.getById('item-1').name = 'Changed'
    itemStore.getAll()[0].name = 'Changed'

    expect(itemStore.getById('item-1').name).to.equal('White oxford shirt')
  })

  it('reset restores the seed data', () => {
    itemStore.remove('item-1')
    itemStore.reset()

    expect(itemStore.getAll()).to.have.lengthOf(13)
  })
})
