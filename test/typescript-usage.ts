import createSepPaymentGateway = require('../index');

const sepGateway = createSepPaymentGateway({
    SEP_TERMINAL_ID: '123456',
    customizedHTTPPostMethod: async ({ hostname, path, headers, body }) => ({
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify({ hostname, path, headers, body })
    })
});

const invoice = sepGateway.makeInvoice({
  Amount: 1000,
  ResNum: "TS_TEST",
  RedirectURL: "https://example.com/payment/callback",
  TxnRandomSessionKey: "session-key",
})

async function verifyUsage(): Promise<void> {
  const payment = await sepGateway.createPayment(invoice)
  payment.getPaymentUrl()
  payment.getPaymentRedirectHTMLPage()

  const result = await sepGateway.verifyPayment(
    "reference-number",
    "session-key",
  )
  result.getResultCode()
  result.getResultDescription()
  result.getSuccess()
}

void verifyUsage;