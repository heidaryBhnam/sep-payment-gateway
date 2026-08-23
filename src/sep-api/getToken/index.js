const createGetTokenRequest = require("./src/createGetTokenRequest")
const translateGetTokenResponse = require("./src/translateGetTokenResponse")
const buildGetToken = require("./src/getToken")

module.exports = function ({
  SEP_GET_TOKEN_PATH,
  httpClientPostInterceptor,
  SEP_TERMINAL_ID,
}) {
  const getToken = buildGetToken({
    SEP_GET_TOKEN_PATH: SEP_GET_TOKEN_PATH,
    SEP_TERMINAL_ID: SEP_TERMINAL_ID,
    createGetTokenRequest: createGetTokenRequest,
    httpClientPostInterceptor: httpClientPostInterceptor,
    translateGetTokenResponse: translateGetTokenResponse,
  })

  return getToken
}