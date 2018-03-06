const gh = require('./github')
const logic = require('./logic')
const T = require('tcomb')

function getReportForPullRequests (prs) {
  return prs.reduce((acc, pr) => {
    if (logic.isPrObsolte(pr)) {
      acc += `* Pull requests: [${pr.title}](${pr.url}) \r\n`
    }
    return acc
  }, '')
}

async function getReport (githubToken) {
  T.String(githubToken)
  const githubConnector = gh({
    token: githubToken,
    organization: 'taskworld'
  })
  const res = await githubConnector.getAllPullRequests()
  const report = res.reduce((acc, repo) => {
    acc += `## Obsolete pull request for repository ${repo.repoName}: \r\n`
    acc += getReportForPullRequests(repo.data)
    return acc
  }, '')
  return report
}

module.exports = {
  getReport
}
