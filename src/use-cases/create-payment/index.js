const buildCreatePayment = require("./src/create-payment")

module.exports = function (getTokenApi, SEP_HOST) {
  const createPayment = buildCreatePayment(getTokenApi, SEP_HOST)

  return createPayment
}