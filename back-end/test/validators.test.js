import { expect } from 'chai'
import {
  isValidEmail,
  isValidPassword,
  isPositiveInteger,
  isValidWearPeriod,
} from '../validators.js'

describe('validators', () => {
  describe('isValidEmail', () => {
    it('accepts normal addresses, ignoring surrounding spaces', () => {
      expect(isValidEmail('sam@example.com')).to.equal(true)
      expect(isValidEmail('  sam@example.com  ')).to.equal(true)
    })

    it('rejects malformed or non-string values', () => {
      for (const value of ['', 'sam', 'sam@', 'sam@example', 'sa m@example.com', null, 42]) {
        expect(isValidEmail(value), String(value)).to.equal(false)
      }
    })
  })

  describe('isValidPassword', () => {
    it('requires at least 8 characters', () => {
      expect(isValidPassword('12345678')).to.equal(true)
      expect(isValidPassword('1234567')).to.equal(false)
    })

    it('rejects non-string values', () => {
      expect(isValidPassword(12345678)).to.equal(false)
      expect(isValidPassword(undefined)).to.equal(false)
    })
  })

  describe('isPositiveInteger', () => {
    it('accepts positive whole numbers and numeric strings', () => {
      expect(isPositiveInteger(1)).to.equal(true)
      expect(isPositiveInteger('25')).to.equal(true)
    })

    it('rejects zero, negatives, decimals, huge values and non-numbers', () => {
      for (const value of [0, -3, 1.5, '2.5', '', ' ', 'abc', 2 ** 53, NaN, Infinity, null, true, [3]]) {
        expect(isPositiveInteger(value), String(value)).to.equal(false)
      }
    })
  })

  describe('isValidWearPeriod', () => {
    it('accepts only the known estimate periods', () => {
      expect(isValidWearPeriod('this-year')).to.equal(true)
      expect(isValidWearPeriod('last-year')).to.equal(true)
      expect(isValidWearPeriod('all-time')).to.equal(true)
      expect(isValidWearPeriod('last-month')).to.equal(false)
      expect(isValidWearPeriod(undefined)).to.equal(false)
    })
  })
})
