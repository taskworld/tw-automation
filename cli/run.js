const Taskworld = require('../src/taskworld')
const report = require('../src/report')
const Config = require('../src/config')

const channelId = Config.TASKWORLD_CHANNEL_ID
const spaceId = Config.TASKWORLD_SPACE_ID

async function run () {
  const reportString = await report.getReport(Config.GITHUB_TOKEN)
  const client = await Taskworld.getAuthenticatedTaskworldClient({
    username: Config.TASKWORLD_USERNAME,
    password: Config.TASKWORLD_PASSWORD
  })
  await client.createMessageForChannel(channelId, spaceId, reportString)
}

run().catch(err => console.log(err))
