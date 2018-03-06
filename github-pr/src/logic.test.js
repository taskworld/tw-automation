const { assert } = require('chai')
const logic = require('./logic')
const moment = require('moment')

describe('github logic', () => {
  const assertErrMessage = (func, message) => {
    try {
      func()
      throw new Error('AssertErrMessage')
    } catch (err) {
      if (err.message === 'AssertErrMessage') {
        throw Error('Function did not throw')
      }
      assert(err.message === message, `Should throw error "${message}", instead throw "${err.message}"`)
    }
  }
  describe('Pull request obsolete', () => {
    it('should obsolete if no update within two weeks', () => {
      const now = moment('2017-07-14')
      const pr = {
        updated_at: moment('2017-06-29').toISOString()
      }
      assert(logic.isPrObsolte(pr, now), 'Should obsolete')
    })

    it('should not obsolete if have updated within two weeks', () => {
      const now = moment('2017-07-14')
      const pr = {
        updated_at: moment('2017-07-07').toISOString()
      }
      assert(!logic.isPrObsolte(pr, now), 'Should not obsolete')
    })

    it('should throw if object does not have updated_at (which means maybe not pr)', () => {
      assertErrMessage(() => logic.isPrObsolte(null), 'Input is not pull request object')
    })
  })

  describe('Pull request warning level', () => {
    it('should throw if object does not have updated_at (which means maybe not pr)', () => {
      assertErrMessage(() => logic.getPrWarningLevel(null), 'Input is not pull request object')
    })

    it('should return level 0 if updated within 3 days', () => {
      const now = moment('2017-07-14')
      const pr = {
        updated_at: moment('2017-07-12').toISOString()
      }
      assert(logic.getPrWarningLevel(pr, now).level === 0)
    })

    it('should return level 1 if updated more than 3 days within 7 days', () => {
      const now = moment('2017-07-14')
      const pr = {
        updated_at: moment('2017-07-10').toISOString()
      }
      assert(logic.getPrWarningLevel(pr, now).level === 1)
    })

    it('should return level 2 if updated more than 7 days within 12 days', () => {
      const now = moment('2017-07-14')
      const pr = {
        updated_at: moment('2017-07-06').toISOString()
      }
      assert(logic.getPrWarningLevel(pr, now).level === 2)
    })

    it('should return level 3 if updated more than 12 days within 14 days', () => {
      const now = moment('2017-07-14')
      const pr = {
        updated_at: moment('2017-07-01').toISOString()
      }
      assert(logic.getPrWarningLevel(pr, now).level === 3)
    })

    it('should return level 4 if updated more than 14 days ago', () => {
      const now = moment('2017-07-14')
      const pr = {
        updated_at: moment('2017-06-29').toISOString()
      }
      assert(logic.getPrWarningLevel(pr, now).level === 4)
    })
  })
})
