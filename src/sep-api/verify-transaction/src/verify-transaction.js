module.exports = function buildVerifyTransaction({
  SEP_VERIFY_TRANSACTION_PATH,
  SEP_TERMINAL_ID,
  httpClientPostInterceptor,
  createVerifyTransactionRequest,
  translateVerifyTransactionResponse,
}) {
  if (!SEP_VERIFY_TRANSACTION_PATH)
    throw new Error(
      "buildVerifyTransaction must have SEP_VERIFY_TRANSACTION_PATH.",
    )

  if (!httpClientPostInterceptor)
    throw new Error(
      "buildVerifyTransaction must have httpClientPostInterceptor.",
    )

  if (!createVerifyTransactionRequest)
    throw new Error(
      "buildVerifyTransaction must have createVerifyTransactionRequest.",
    )

  if (!translateVerifyTransactionResponse)
    throw new Error(
      "buildVerifyTransaction must have translateVerifyTransactionResponse.",
    )

  return async function verifyTransaction(RefNum, TxnRandomSessionKey) {
    if (!RefNum) throw new Error("verifyTransaction must have RefNum.")

    const verifyTransactionJsonData = createVerifyTransactionRequest({
      SEP_TERMINAL_ID: SEP_TERMINAL_ID,
      RefNum: RefNum,
      TxnRandomSessionKey: TxnRandomSessionKey,
    })

    const { httpResponseJsonData, httpResponseHeaders } =
      await httpClientPostInterceptor({
        path: SEP_VERIFY_TRANSACTION_PATH,
        jsonData: verifyTransactionJsonData,
      })

    const result = translateVerifyTransactionResponse({
      headers: httpResponseHeaders,
      jsonData: httpResponseJsonData,
    })

    return result
  }
}