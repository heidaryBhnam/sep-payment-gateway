module.exports = function buildGetToken({
  SEP_GET_TOKEN_PATH,
  httpClientPostInterceptor,
  createGetTokenRequest,
  translateGetTokenResponse,
  SEP_TERMINAL_ID,
}) {
  if (!SEP_GET_TOKEN_PATH)
    throw new Error("buildGetToken must have SEP_GET_TOKEN_PATH.")

  if (!httpClientPostInterceptor)
    throw new Error("buildGetToken must have httpClientPostInterceptor.")

  if (!createGetTokenRequest)
    throw new Error("buildGetToken must have createGetTokenRequest.")

  if (!translateGetTokenResponse)
    throw new Error("buildGetToken must have translateGetTokenResponse.")
  

  return async function getToken({
    Amount,
    ResNum,
    RedirectURL,
    CellNumber,
    TxnRandomSessionKey,
    TranType,
    SettlementIbanInfo,
  }) {
    const getTokenJsonData = createGetTokenRequest({
      SEP_TERMINAL_ID: SEP_TERMINAL_ID,
      Amount: Amount,
      ResNum: ResNum,
      RedirectURL: RedirectURL,
      CellNumber: CellNumber,
      TxnRandomSessionKey: TxnRandomSessionKey,
      TranType: TranType,
      SettlementIbanInfo: SettlementIbanInfo,
    })

    const { httpResponseJsonData, httpResponseHeaders } =
      await httpClientPostInterceptor({
        path: SEP_GET_TOKEN_PATH,
        jsonData: getTokenJsonData,
      })

    const result = translateGetTokenResponse({
      headers: httpResponseHeaders,
      jsonData: httpResponseJsonData,
    })

    return result
  }
}