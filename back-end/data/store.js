// In-memory store for the mock data. Changes last until the server restarts.
import { categories } from './categories.js'
import { items } from './items.js'
import { wears } from './wears.js'

function createCollection(seedRecords, idPrefix) {
  let records = []
  let nextNumber = 1

  function reset() {
    records = structuredClone(seedRecords)
    nextNumber = records.length + 1
  }

  function newId() {
    let id = `${idPrefix}-${nextNumber}`
    while (records.some((record) => record.id === id)) {
      nextNumber += 1
      id = `${idPrefix}-${nextNumber}`
    }
    nextNumber += 1
    return id
  }

  function getAll() {
    return structuredClone(records)
  }

  function getById(id) {
    const record = records.find((r) => r.id === id)
    return record ? structuredClone(record) : null
  }

  function add(fields) {
    const record = { ...structuredClone(fields), id: newId() }
    records.push(record)
    return structuredClone(record)
  }

  function update(id, changes) {
    const index = records.findIndex((r) => r.id === id)
    if (index === -1) return null
    records[index] = { ...records[index], ...structuredClone(changes), id }
    return structuredClone(records[index])
  }

  function remove(id) {
    const index = records.findIndex((r) => r.id === id)
    if (index === -1) return null
    const [removed] = records.splice(index, 1)
    return removed
  }

  reset()
  return { getAll, getById, add, update, remove, reset }
}

export const itemStore = createCollection(items, 'item')
export const wearStore = createCollection(wears, 'wear')

export function getCategories() {
  return [...categories]
}
