const github = require('./github')
const Config = require('./config')

let _client = null

function getClient (token = Config.GITHUB_TOKEN) {
  if (!_client) {
    _client = github({
      token: token,
      organization: 'taskworld'
    })
  }
  return _client
}

module.exports = {
  getClient
}
