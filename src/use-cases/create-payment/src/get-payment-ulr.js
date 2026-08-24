module.exports = function buildGetPaymentUrl(
  token,
  SEP_BASE_URL = "https://sep.shaparak.ir",
) {
  if (!token) throw new Error("getPaymentUrl must have token.")

  return function getPaymentUrl() {
    const paymentUrl = `${SEP_BASE_URL}/OnlinePG/SendToken?token=${encodeURIComponent(token)}`

    return paymentUrl
  }
}
