const githubClient = require('./githubClient')
const logic = require('./logic')
const T = require('tcomb')
const _ = require('lodash')

function getObsoleteReportForPullRequests (prs, repoName) {
  const title = `### Today I will closed these obsolete pull request for repository **${repoName}**: \r\n`
  const obsoltePrs = prs.filter(c => logic.isPrObsolte(c))
  if (obsoltePrs.length === 0) return ''
  return title + obsoltePrs.reduce((acc, pr) => {
    acc += `* Pull requests: [${pr.title}](${pr.html_url}) \r\n`
    return acc
  }, '')
}

function getWarningReportForPullRequests (prs, repoName) {
  const title = `### These pull requests in repo **${repoName}** have not been updated for sometimes. Let's try merge these PRs to master!! \r\n`
  const warningPrs = prs.filter(c => {
    const warningLevel = logic.getPrWarningLevel(c).level
    return warningLevel >= 1 && warningLevel <= 3
  })
  if (warningPrs.length === 0) return ''
  return title + warningPrs.reduce((acc, pr) => {
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
    acc += getObsoleteReportForPullRequests(repo.data, repo.repoName)
    acc += getWarningReportForPullRequests(repo.data, repo.repoName)
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