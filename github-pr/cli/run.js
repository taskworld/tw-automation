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
  if (reportData.pullRequests.length >= 10) {
    reportData.report += `\r\n Let me close all outdated work and call it a day.`
  }
  await client.createMessageForChannel(channelId, spaceId, reportData.report)

  const githubClient = GithubClient.getClient()
  for (let pr of reportData.pullRequests) {
    await githubClient.closePullRequest(pr.number, pr.repo, 'This PRs is closed because it is too old.')
  }
}

run().catch(err => console.log(err))
