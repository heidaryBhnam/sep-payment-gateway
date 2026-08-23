module.exports = function ({
  SEP_TERMINAL_ID,
  customizedHTTPPostMethod,
  isOnDevelop,
}) {
  const SEP_HOST = isOnDevelop ? "sep-test.shaparak.ir" : "sep.shaparak.ir"

  const { makeInvoice, makeRefNum, makeTransactionDetail } =
    require("./entities")(SEP_TERMINAL_ID)

  const { createPayment, reversePayment, verifyPayment } =
    require("./use-cases")({
      customizedHTTPPostMethod: customizedHTTPPostMethod,
      SEP_TERMINAL_ID: SEP_TERMINAL_ID,
      SEP_HOST: SEP_HOST,
    })

  const services = Object.freeze({
    makeInvoice,
    makeRefNum,
    makeTransactionDetail,
    createPayment,
    reversePayment,
    verifyPayment,
  })

  return services
}
