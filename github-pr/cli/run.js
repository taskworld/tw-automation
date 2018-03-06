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
  const githubClient = GithubClient.getClient()
  for (let pr of reportData.pullRequests) {
    console.log(`Will closed pull request: ${pr.title}`)
    // githubClient.closePullRequest()
  }
}

run().catch(err => console.log(err))
