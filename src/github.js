const octokit = require('@octokit/rest')()
const T = require('tcomb')
const Promise = require('bluebird')

function setupGithub ({ token, organization, listRepos } = { }) {
  T.String(token)
  organization = organization || 'taskworld'
  listRepos = listRepos || [
    'tw-backend',
    'tw-frontend'
  ]
  octokit.authenticate({
    type: 'token',
    token
  })
  return {
    async getAllPullRequests () {
      return Promise.map(listRepos, async repo => {
        const githubResponse = await octokit.pullRequests.getAll({
          owner: organization,
          repo
        })
        return {
          repoName: repo,
          data: githubResponse.data
        }
      }, { concurrency: 5 })
    },
    getReviews (prNumber, repo) {
      return octokit.pullRequests.getReviews({
        number: prNumber,
        repo
      })
    }
  }
}

module.exports = setupGithub
