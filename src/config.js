require('dotenv').load()
const assert = require('assert')
const config = {
  TASKWORLD_USERNAME: process.env.TASKWORLD_USERNAME,
  TASKWORLD_PASSWORD: process.env.TASKWORLD_PASSWORD,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  TASKWORLD_SPACE_ID: process.env.TASKWORLD_SPACE_ID,
  TASKWORLD_CHANNEL_ID: process.env.TASKWORLD_CHANNEL_ID
}

assert(config.TASKWORLD_USERNAME, 'Require TASKWORLD_USERNAME env')
assert(config.TASKWORLD_PASSWORD, 'Require TASKWORLD_PASSWORD env')
assert(config.GITHUB_TOKEN, 'Require GITHUB_TOKEN env')
assert(config.TASKWORLD_SPACE_ID, 'Require TASKWORLD_SPACE_ID env')
assert(config.TASKWORLD_CHANNEL_ID, 'Require TASKWORLD_CHANNEL_ID env')

module.exports = config
