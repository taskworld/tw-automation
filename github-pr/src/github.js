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
  const createComment = async (prNumber, repoName, message) => {
    return octokit.pullRequests.createReview({
      owner: 'taskworld',
      number: prNumber,
      repo: repoName,
      body: 'hello',
      event: 'COMMENT'
    })
  }
  const obj = {
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
    },
    async closePullRequest (prNumber, repoName, message) {
      await createComment(prNumber, repoName, message)
      return octokit.pullRequests.update({
        owner: 'taskworld',
        number: prNumber,
        repo: repoName,
        state: 'closed'
      })
    }
  }
  return obj
}

module.exports = setupGithub
