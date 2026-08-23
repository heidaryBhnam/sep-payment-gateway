const makeInvoice = require("./invoice")
const makeRefNum = require("./ref-num")

module.exports = function (SEP_TERMINAL_ID) {
  const makeTransactionDetail = require("./transaction-detail")({
    makeRefNum: makeRefNum,
    SEP_TERMINAL_ID: SEP_TERMINAL_ID,
  })

  const entities = Object.freeze({
    makeInvoice,
    makeRefNum,
    makeTransactionDetail,
  })

  return entities
}
