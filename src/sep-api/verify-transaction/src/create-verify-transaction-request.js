module.exports = function createVerifyTransactionRequest({
  SEP_TERMINAL_ID,
  RefNum,
  TxnRandomSessionKey,
}) {
  if (!RefNum)
    throw new Error("createVerifyTransactionRequest must have RefNum.")

  const jsonData = { terminalnumber: parseInt(SEP_TERMINAL_ID), refnum: RefNum }

  if (TxnRandomSessionKey !== undefined)
    jsonData.TxnRandomSessionKey = TxnRandomSessionKey
  

  return jsonData
}