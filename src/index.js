module.exports = function ({
  SEP_TERMINAL_ID,
  customizedHTTPPostMethod,
  isOnDevelop,
  SEP_BASE_URL,
}) {
  const sepBaseUrl =
    SEP_BASE_URL ||
    (isOnDevelop ? "http://127.0.0.1:4100" : "https://sep.shaparak.ir")

  const { makeInvoice, makeRefNum, makeTransactionDetail } =
    require("./entities")(SEP_TERMINAL_ID)

  const { createPayment, reversePayment, verifyPayment } =
    require("./use-cases")({
      customizedHTTPPostMethod: customizedHTTPPostMethod,
      SEP_TERMINAL_ID: SEP_TERMINAL_ID,
      SEP_BASE_URL: sepBaseUrl,
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
