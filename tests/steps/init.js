const { promisify } = require('util')
const awscred = require('awscred')
const dotenv = require('dotenv')
// NOTE: the order these files are loaded is important. Because we want the .env.local 
// to override whatever is in .env file, so we have to load it first. This is how the dotenv
// module handles overlapping env variables - the first one wins.
dotenv.config({ path: './.env.local' })
dotenv.config()

let initialized = false

const init = async () => {
  if (initialized) {
    return
  }
  
  const { credentials, region } = await promisify(awscred.load)()
  
  process.env.AWS_ACCESS_KEY_ID     = credentials.accessKeyId
  process.env.AWS_SECRET_ACCESS_KEY = credentials.secretAccessKey
  process.env.AWS_REGION            = region

  if (credentials.sessionToken) {
    process.env.AWS_SESSION_TOKEN = credentials.sessionToken
  }

  console.log('AWS credential loaded')

  initialized = true
}

module.exports = {
  init
}
