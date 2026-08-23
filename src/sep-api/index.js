const DEFAULT_SEP_HOST = "sep.shaparak.ir"
const SEP_GET_TOKEN_PATH = "/onlinepg/OnlinePG"
const SEP_VERIFY_TRANSACTION_PATH =
  "/verifyTxnRandomSessionkey/ipg/VerifyTranscation"
const SEP_REVERSE_TRANSACTION_PATH =
  "/verifyTxnRandomSessionkey/ipg/ReverseTransaction"

module.exports = function ({
  customizedHTTPPostMethod,
  SEP_TERMINAL_ID,
  SEP_HOST,
}) {
  const sepHost = SEP_HOST || DEFAULT_SEP_HOST

  const httpClientPostInterceptor = require("./http-interceptor")({
    customizedHTTPPostMethod: customizedHTTPPostMethod,
    SEP_HOST: sepHost,
  })

  const getToken = require("./getToken")({
    SEP_GET_TOKEN_PATH: SEP_GET_TOKEN_PATH,
    SEP_TERMINAL_ID: SEP_TERMINAL_ID,
    httpClientPostInterceptor: httpClientPostInterceptor,
  })

  const verifyTransaction = require("./verify-transaction")({
    SEP_VERIFY_TRANSACTION_PATH: SEP_VERIFY_TRANSACTION_PATH,
    SEP_TERMINAL_ID: SEP_TERMINAL_ID,
    httpClientPostInterceptor: httpClientPostInterceptor,
  })

  const reverseTransaction = require("./reverse-transaction")({
    SEP_REVERSE_TRANSACTION_PATH: SEP_REVERSE_TRANSACTION_PATH,
    httpClientPostInterceptor: httpClientPostInterceptor,
  })

  const sepAPI = Object.freeze({
    getToken,
    verifyTransaction,
    reverseTransaction,
  })

  return sepAPI
}
