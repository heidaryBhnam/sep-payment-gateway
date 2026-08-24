const buildUseCases = require("./src")

module.exports = function ({
  SEP_TERMINAL_ID,
  customizedHTTPPostMethod,
  isOnDevelop,
  SEP_BASE_URL,
}) {
  const useCases = buildUseCases({
    customizedHTTPPostMethod: customizedHTTPPostMethod,
    SEP_TERMINAL_ID: SEP_TERMINAL_ID,
    isOnDevelop: isOnDevelop,
    SEP_BASE_URL: SEP_BASE_URL,
  })

  return useCases
}
