module.exports = function ({
  customizedHTTPPostMethod,
  SEP_TERMINAL_ID,
  SEP_HOST,
}) {
  const sepApiServices = require("../sep-api")({
    customizedHTTPPostMethod: customizedHTTPPostMethod,
    SEP_TERMINAL_ID: SEP_TERMINAL_ID,
    SEP_HOST: SEP_HOST,
  })

  const createPayment = require("./create-payment")(
    sepApiServices.getToken,
    SEP_HOST,
  )

  const verifyPayment = require("./verify-payment")(
    sepApiServices.verifyTransaction,
  )

  const reversePayment = require("./reverse-payment")(
    sepApiServices.reverseTransaction,
  )

  const use_cases = Object.freeze({
    createPayment,
    verifyPayment,
    reversePayment,
  })

  return use_cases
}
