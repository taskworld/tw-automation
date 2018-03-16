const Taskworld = require('../src/taskworld')
const report = require('../src/report')
const Config = require('../src/config')
const GithubClient = require('../src/githubClient')

const channelId = Config.TASKWORLD_CHANNEL_ID
const spaceId = Config.TASKWORLD_SPACE_ID

async function run () {
  const githubClient = GithubClient.getClient()
  await githubClient.createComment(1309, 'tw-backend', 'Hello')
  console.log('Done')
}

run().catch(err => console.log(err))
