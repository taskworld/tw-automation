const axios = require('axios')
const Config = require('./config')
async function getAuthenticatedTaskworldClient ({ username, password, rootUrl = Config.TASKWORLD_API_URL }) {
  const authen = await axios.post(`${rootUrl}/v1/auth`, { email: username, password })
  const accessToken = authen.data.access_token
  return {
    async createMessageForChannel (channelId, spaceId, message) {
      console.log(message)
      const response = await axios.post(`${rootUrl}/v1/message.create`, {
        'access_token': accessToken,
        'space_id': spaceId,
        'parent_id': channelId,
        'parent_type': 'channel',
        'body': message
      })
      return response.data
    },
    async getChannels (spaceId) {
      const response = await axios.post(`${rootUrl}/v1/channel.get-all`, {
        access_token: accessToken,
        space_id: spaceId,
        max: 10
      })
      return response.data
    }
  }
}

module.exports = {
  getAuthenticatedTaskworldClient
}
