const Taskworld = require('../src/taskworld')
const report = require('../src/report')
const Config = require('../src/config')
const GithubClient = require('../src/githubClient')

const channelId = Config.TASKWORLD_CHANNEL_ID
const spaceId = Config.TASKWORLD_SPACE_ID

async function run () {
  const reportData = await report.getReportAndObsoletePRs(Config.GITHUB_TOKEN)
  const client = await Taskworld.getAuthenticatedTaskworldClient({
    username: Config.TASKWORLD_USERNAME,
    password: Config.TASKWORLD_PASSWORD
  })
  await client.createMessageForChannel(channelId, spaceId, reportData.report)
  if (reportData.pullRequests.length > 10) {
    await client.createMessageForChannel(channelId, spaceId, `**There are ${reportData.pullRequests.length} old pull requests. I would encorage us to do fewer things at a time. Let me close all outdated work and call it a day.**`)
  }
  const githubClient = GithubClient.getClient()
  for (let pr of reportData.pullRequests) {
    await githubClient.closePullRequest(pr.number, pr.repoName, 'TEST-RUN: This PRs is closed because it is too old.')
  }
}

run().catch(err => console.log(err))
