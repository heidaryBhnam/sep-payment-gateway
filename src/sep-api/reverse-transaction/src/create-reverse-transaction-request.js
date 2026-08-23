module.exports = function createReverseTransactionRequest(RefNum) {
  if (!RefNum)
    throw new Error("createReverseTransactionRequest must have RefNum.")

  return { RefNum: RefNum }
}
