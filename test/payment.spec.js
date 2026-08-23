const createSepPaymentGateway = require("../index")
const createGetTokenRequest = require("../src/sep-api/getToken/src/createGetTokenRequest")
const translateHttpClientPostInterceptorResponse = require("../src/sep-api/http-interceptor/src/translate-http-client-post-interceptor-response")

describe("SEP 3.6 API contract", () => {
  it("creates a token request using SEP 3.6 fields", async () => {
    const requests = []
    const gateway = createSepPaymentGateway({
      SEP_TERMINAL_ID: "123456",
      customizedHTTPPostMethod: async (request) => {
        requests.push(request)
        return {
          headers: { "content-type": "application/json" },
          data: JSON.stringify({ status: 1, token: "token&123" }),
        }
      },
    })

    const invoice = gateway.makeInvoice({
      Amount: 1000,
      ResNum: "RES-123",
      RedirectURL: "https://example.com/callback",
      CellNumber: "912222222",
      TxnRandomSessionKey: "session-123",
      TranType: "Government",
    })

    const payment = await gateway.createPayment(invoice)
    const body = JSON.parse(requests[0].body)

    expect(requests[0].path).toBe("/onlinepg/OnlinePG")
    expect(body).toEqual({
      Action: "Token",
      TerminalId: "123456",
      Amount: 1000,
      ResNum: "RES-123",
      RedirectUrl: "https://example.com/callback",
      CellNumber: "912222222",
      TxnRandomSessionKey: "session-123",
      TranType: "Government",
    })
    expect(payment.getToken()).toBe("token&123")
    expect(payment.getPaymentRedirectHTMLPage()).toContain(
      'name="Token" value="token&amp;123"',
    )
    expect(payment.getPaymentUrl()).toBe(
      "https://sep.shaparak.ir/OnlinePG/SendToken?token=token%26123",
    )
  })

  it("creates a verify request using SEP 3.6 fields", async () => {
    const requests = []
    const gateway = createSepPaymentGateway({
      SEP_TERMINAL_ID: "123456",
      customizedHTTPPostMethod: async (request) => {
        requests.push(request)
        return {
          headers: { "content-type": "application/json" },
          data: JSON.stringify({
            ResultCode: 0,
            ResultDescription: "Success",
            Success: true,
            TransactionDetail: {},
          }),
        }
      },
    })

    const result = await gateway.verifyPayment("REF-123", "session-123")
    const body = JSON.parse(requests[0].body)

    expect(requests[0].path).toBe(
      "/verifyTxnRandomSessionkey/ipg/VerifyTranscation",
    )
    expect(body).toEqual({
      terminalnumber: 123456,
      refnum: "REF-123",
      TxnRandomSessionKey: "session-123",
    })
    expect(result.getSuccess()).toBe(true)
  })

  it("uses a configured SEP host for API requests and redirects", async () => {
    const requests = []
    const gateway = createSepPaymentGateway({
      SEP_TERMINAL_ID: "123456",
      isOnDevelop: true,
      customizedHTTPPostMethod: async (request) => {
        requests.push(request)
        return {
          headers: { "content-type": "application/json" },
          data: JSON.stringify({ status: 1, token: "test-token" }),
        }
      },
    })

    const invoice = gateway.makeInvoice({
      Amount: 1000,
      ResNum: "RES-TEST",
      RedirectURL: "https://example.com/callback",
    })
    const payment = await gateway.createPayment(invoice)

    expect(requests[0].hostname).toBe("sep-test.shaparak.ir")
    expect(payment.getPaymentUrl()).toBe(
      "https://sep-test.shaparak.ir/OnlinePG/SendToken?token=test-token",
    )
    expect(payment.getPaymentRedirectHTMLPage()).toContain(
      "https://sep-test.shaparak.ir/OnlinePG/OnlinePG",
    )
  })

  it.todo("reverse payment")

  it("rejects non-finite payment amounts", () => {
    expect(() =>
      createGetTokenRequest({
        SEP_TERMINAL_ID: "123456",
        Amount: Number.NaN,
        ResNum: "RES-123",
        RedirectURL: "https://example.com/callback",
      }),
    ).toThrow()

    expect(() =>
      createGetTokenRequest({
        SEP_TERMINAL_ID: "123456",
        Amount: Number.POSITIVE_INFINITY,
        ResNum: "RES-123",
        RedirectURL: "https://example.com/callback",
      }),
    ).toThrow()
  })

  it("rejects malformed JSON responses without exposing response data", async () => {
    await expect(
      translateHttpClientPostInterceptorResponse({
        httpResponse: {
          headers: { "content-type": "application/json" },
          data: '{"token":"secret",',
        },
      }),
    ).rejects.toThrow("received invalid JSON")
  })
})
