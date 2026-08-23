module.exports = function createGetTokenRequest({
  SEP_TERMINAL_ID,
  Amount,
  ResNum,
  RedirectURL,
  CellNumber,
  TxnRandomSessionKey,
  TranType,
  SettlementIbanInfo,
}) {
  if (!Amount) throw new Error("createGetTokenRequest must have Amount.")
  else if (typeof Amount != "number")
    throw new Error("createGetTokenRequest>Amount must have number.")

  if (!ResNum) throw new Error("createGetTokenRequest must have ResNum.")

  if (!RedirectURL)
    throw new Error("createGetTokenRequest must have RedirectURL.")

  let jsonData = {
    Action: "Token",
    TerminalId: SEP_TERMINAL_ID,
    Amount: Amount,
    ResNum: ResNum,
    RedirectUrl: RedirectURL,
  }

  if (CellNumber !== undefined) jsonData.CellNumber = CellNumber

  if (TxnRandomSessionKey !== undefined)
    jsonData.TxnRandomSessionKey = TxnRandomSessionKey

  if (TranType !== undefined) jsonData.TranType = TranType

  if (SettlementIbanInfo !== undefined)
    jsonData.SettlementIbanInfo = SettlementIbanInfo
  

  return jsonData
}