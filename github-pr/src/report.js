const githubClient = require('./githubClient')
const logic = require('./logic')
const T = require('tcomb')
const _ = require('lodash')

function getReportForPullRequests (prs) {
  const obsoltePrs = prs.filter(c => logic.isPrObsolte(c))
  return obsoltePrs.reduce((acc, pr) => {
    acc += `* Pull requests: [${pr.title}](${pr.html_url}) \r\n`
    return acc
  }, '')
}

function getObsoletePrs (allPullRequests) {
  return _.flatten(allPullRequests.reduce((acc, repo) => {
    const result = repo.data.filter(pr => logic.isPrObsolte(pr)).map(pr => {
      return {
        repo: repo.repoName,
        number: pr.number,
        title: pr.title
      }
    })
    return [ ...acc, ...result ]
  }, [ ]))
}

function getReportFromPRs (allPullRequests) {
  return allPullRequests.reduce((acc, repo) => {
    acc += `## Today I will closed these obsolete pull request for repository ${repo.repoName}: \r\n`
    acc += getReportForPullRequests(repo.data)
    return acc
  }, '')
}

async function getReportAndObsoletePRs (githubToken) {
  T.String(githubToken)
  const githubConnector = githubClient.getClient()
  const res = await githubConnector.getAllPullRequests()
  const report = getReportFromPRs(res)
  return {
    report,
    pullRequests: getObsoletePrs(res)
  }
}

module.exports = {
  getReportAndObsoletePRs
}
