const axios = require('axios')

async function getAuthenticatedTaskworldClient ({ username, password }) {
  const authen = await axios.post('https://api.taskworld.com/v1/auth', { email: username, password })
  const accessToken = authen.data.access_token
  return {
    async createMessageForChannel (channelId, spaceId, message) {
      const response = await axios.post('https://api.taskworld.com/v1/message.create', {
        'access_token': accessToken,
        'space_id': spaceId,
        'parent_id': channelId,
        'parent_type': 'channel',
        'body': message
      })
      return response.data
    },
    async getChannels (spaceId) {
      const response = await axios.post('https://api.taskworld.com/v1/channel.get-all', {
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
