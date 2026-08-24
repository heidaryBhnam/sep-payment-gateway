const http = require("http")
const createSepPaymentGateway = require("../index")
const { createSimulatorServer } = require("../simulator/server")

function request(method, requestURL, body) {
  const url = new URL(requestURL)
  const payload = body
    ? typeof body === "string"
      ? body
      : JSON.stringify(body)
    : undefined

  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        method,
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        headers: payload
          ? {
              "content-type":
                typeof body === "string"
                  ? "application/x-www-form-urlencoded"
                  : "application/json",
              "content-length": Buffer.byteLength(payload),
            }
          : undefined,
      },
      (response) => {
        let data = ""
        response.setEncoding("utf8")
        response.on("data", (chunk) => (data += chunk))
        response.on("end", () => resolve({ response, data }))
      },
    )
    request.on("error", reject)
    if (payload) request.write(payload)
    request.end()
  })
}

describe("local SEP simulator", () => {
  let server
  let baseURL

  beforeAll(async () => {
    server = createSimulatorServer()
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
    baseURL = `http://127.0.0.1:${server.address().port}`
  })

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve))
  })

  it("runs a successful payment through the simulated page and APIs", async () => {
    const gateway = createSepPaymentGateway({
      SEP_TERMINAL_ID: "123456",
      SEP_BASE_URL: baseURL,
    })
    const invoice = gateway.makeInvoice({
      Amount: 1000,
      ResNum: "SIM-SUCCESS",
      RedirectURL: "http://merchant.local/callback",
      TxnRandomSessionKey: "session-success",
    })

    const payment = await gateway.createPayment(invoice)
    const page = await request("GET", payment.getPaymentUrl())
    expect(page.response.statusCode).toBe(200)
    expect(page.data).toContain("SEP Payment Simulator")
    expect(page.data).toContain("Insufficient balance")

    const redirectHTML = payment.getPaymentRedirectHTMLPage()
    const tokenForm = new URLSearchParams({
      Token: payment.getToken(),
      GetMethod: "true",
    })
    const formPage = await request(
      "POST",
      `${baseURL}/OnlinePG/OnlinePG`,
      tokenForm.toString(),
    )
    expect(redirectHTML).toContain(`${baseURL}/OnlinePG/OnlinePG`)
    expect(formPage.response.statusCode).toBe(200)
    expect(formPage.data).toContain("SEP Payment Simulator")

    const scenario = await request(
      "POST",
      `${baseURL}/OnlinePG/SendToken/${payment.getToken()}/success`,
    )
    expect(scenario.response.statusCode).toBe(303)
    expect(scenario.response.headers.location).toContain("State=OK")
    expect(scenario.response.headers.location).toContain("RefNum=SIM-REF-1")

    const verified = await gateway.verifyPayment("SIM-REF-1", "session-success")
    expect(verified.getSuccess()).toBe(true)
    expect(verified.getTransactionDetail().OrginalAmount).toBe(1000)

    const reversed = await gateway.reversePayment("SIM-REF-1")
    expect(reversed.getSuccess()).toBe(true)
    await expect(gateway.reversePayment("SIM-REF-1")).rejects.toThrow(
      "already reversed",
    )
  })

  it("returns the selected failure scenario and rejects verification", async () => {
    const gateway = createSepPaymentGateway({
      SEP_TERMINAL_ID: "123456",
      SEP_BASE_URL: baseURL,
    })
    const invoice = gateway.makeInvoice({
      Amount: 2000,
      ResNum: "SIM-DECLINED",
      RedirectURL: "http://merchant.local/callback",
      TxnRandomSessionKey: "session-declined",
    })
    const payment = await gateway.createPayment(invoice)

    const scenario = await request(
      "POST",
      `${baseURL}/OnlinePG/SendToken/${payment.getToken()}/declined`,
    )
    expect(scenario.response.headers.location).toContain("State=Canceled")
    await expect(
      gateway.verifyPayment("SIM-REF-2", "session-declined"),
    ).rejects.toThrow("Declined payment")
    await expect(
      gateway.verifyPayment("SIM-REF-2", "wrong-session"),
    ).rejects.toThrow("Invalid session key")
  })
})
