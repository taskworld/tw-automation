const moment = require('moment')

function isPrObsolte (pullRequest, now = moment()) {
  if (!pullRequest || !pullRequest.updated_at) {
    throw new Error('Input is not pull request object')
  }
  return moment(pullRequest.updated_at).isBefore(now.subtract(2, 'weeks'))
}

module.exports = {
  isPrObsolte
}
