const githubClient = require('./githubClient')
const logic = require('./logic')
const T = require('tcomb')
const _ = require('lodash')

function getReportForPullRequests (prs) {
  return prs.reduce((acc, pr) => {
    if (logic.isPrObsolte(pr)) {
      acc += `* Pull requests: [${pr.title}](${pr.url}) \r\n`
    }
    return acc
  }, '')
}

async function getReportAndObsoletePRs (githubToken) {
  T.String(githubToken)
  const githubConnector = githubClient.getClient()
  const res = await githubConnector.getAllPullRequests()
  const report = res.reduce((acc, repo) => {
    acc += `## Today I will closed these obsolete pull request for repository ${repo.repoName}: \r\n`
    acc += getReportForPullRequests(repo.data)
    return acc
  }, '')
  const obsoletePrs = _.flatMap(res, r => r.data).filter(r => logic.isPrObsolte(r))
  return {
    report,
    pullRequests: obsoletePrs
  }
}

module.exports = {
  getReportAndObsoletePRs
}
