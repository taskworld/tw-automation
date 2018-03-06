const moment = require('moment')

function isPrObsolte (pullRequest, now = moment()) {
  return getPrWarningLevel(pullRequest, now).level === 4
}

function getPrWarningLevel (pullRequest, now = moment()) {
  if (!pullRequest || !pullRequest.updated_at) {
    throw new Error('Input is not pull request object')
  }
  const dayDiff = Math.abs(moment(pullRequest.updated_at).diff(now, 'days'))
  if (dayDiff <= 3) return { level: 0 }
  if (dayDiff <= 7) return { level: 1 }
  if (dayDiff <= 12) return { level: 2 }
  if (dayDiff <= 14) return { level: 3 }
  return {
    level: 4
  }
}

module.exports = {
  isPrObsolte,
  getPrWarningLevel
}
