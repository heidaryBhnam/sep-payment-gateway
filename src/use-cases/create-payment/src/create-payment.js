const buildGetPaymentRedirectHTMLPage = require("./get-payment-redirect-html-page")
const buildGetPaymentUrl = require("./get-payment-ulr")

module.exports = function buildCreatePayment(getTokenApi, SEP_HOST) {
  if (!getTokenApi) throw new Error("buildCreatePayment must have getTokenApi.")

  return async function createPayment(invoice) {
    const { status, token } = await getTokenApi({
      Amount: invoice.getAmount(),
      ResNum: invoice.getResNum(),
      RedirectURL: invoice.getRedirectURL(),
      CellNumber: invoice.getCellNumber(),
      TxnRandomSessionKey: invoice.getTxnRandomSessionKey(),
      TranType: invoice.getTranType(),
      SettlementIbanInfo: invoice.getSettlementIbanInfo(),
    })

    const getPaymentRedirectHTMLPage = buildGetPaymentRedirectHTMLPage(
      token,
      SEP_HOST,
    )
    const getPaymentUrl = buildGetPaymentUrl(token, SEP_HOST)

    const result = Object.freeze({
      getPaymentUrl: getPaymentUrl,
      getPaymentRedirectHTMLPage: getPaymentRedirectHTMLPage,
      getStatus: () => status,
      getToken: () => token,
    })

    return result
  }
}