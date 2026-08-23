const createVerifyTransactionRequest = require("./src/create-verify-transaction-request")
const translateVerifyTransactionResponse = require("./src/translate-verify-transaction-response")
const buildVerifyTransaction = require("./src/verify-transaction")

module.exports = function ({
  httpClientPostInterceptor,
  SEP_VERIFY_TRANSACTION_PATH,
  SEP_TERMINAL_ID,
}) {
  const verifyTransaction = buildVerifyTransaction({
    createVerifyTransactionRequest: createVerifyTransactionRequest,
    httpClientPostInterceptor: httpClientPostInterceptor,
    SEP_VERIFY_TRANSACTION_PATH: SEP_VERIFY_TRANSACTION_PATH,
    SEP_TERMINAL_ID: SEP_TERMINAL_ID,
    translateVerifyTransactionResponse: translateVerifyTransactionResponse,
  })

  return verifyTransaction
}