const { assert } = require('chai')
const logic = require('./logic')
const moment = require('moment')

describe('github logic', () => {
  const assertErrMessage = (func, message) => {
    try {
      func()
    } catch (err) {
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
})
