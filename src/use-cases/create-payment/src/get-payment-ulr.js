module.exports = function buildGetPaymentUrl(
  token,
  SEP_HOST = "sep.shaparak.ir",
) {
  if (!token) throw new Error("getPaymentUrl must have token.")

  return function getPaymentUrl() {
    const paymentUrl = `https://${SEP_HOST}/OnlinePG/SendToken?token=${encodeURIComponent(token)}`

    return paymentUrl
  }
}
