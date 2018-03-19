const githubClient = require('./githubClient')
const logic = require('./logic')
const T = require('tcomb')
const _ = require('lodash')

function getObsoleteReportForPullRequests (prs, repoName) {
  const title = `These PRs in **${repoName}** is outdated and will be closed: \r\n`
  const obsoltePrs = prs.filter(c => logic.isPrObsolte(c))
  if (obsoltePrs.length === 0) return ''
  return title + obsoltePrs.reduce((acc, pr) => {
    acc += `* [${pr.title}](${pr.html_url}) by ${pr.user.login} \r\n`
    return acc
  }, '')
}

function getWarningReportForPullRequests (prs, repoName) {
  const title = `These PRs in **${repoName}** have not been updated for sometimes, and will be outdated soon. \r\n`
  const warningPrs = prs.filter(c => {
    const warningLevel = logic.getPrWarningLevel(c).level
    return warningLevel >= 1 && warningLevel <= 3
  })
  if (warningPrs.length === 0) return ''
  return title + warningPrs.reduce((acc, pr) => {
    acc += `* [${pr.title}](${pr.html_url}) by ${pr.user.login} \r\n`
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
    acc += getObsoleteReportForPullRequests(repo.data, repo.repoName) + '\r\n'
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
