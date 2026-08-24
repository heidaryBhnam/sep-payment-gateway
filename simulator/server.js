const http = require("http")
const { URL } = require("url")

const scenarios = {
  success: { label: "Successful payment", resultCode: 0, success: true },
  declined: {
    label: "Declined payment",
    resultCode: -1,
    success: false,
  },
  cancelled: {
    label: "Cancelled by customer",
    resultCode: -2,
    success: false,
  },
  expired: {
    label: "Expired payment",
    resultCode: -3,
    success: false,
  },
  invalidCard: {
    label: "Invalid card",
    resultCode: -4,
    success: false,
  },
  insufficientFunds: {
    label: "Insufficient balance",
    resultCode: -5,
    success: false,
  },
  communicationError: {
    label: "Communication failure",
    resultCode: 91,
    success: false,
  },
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }

    return entities[character]
  })
}

function sendJSON(response, statusCode, body) {
  response.writeHead(statusCode, { "content-type": "application/json" })
  response.end(JSON.stringify(body))
}

function transactionDetail(transaction) {
  return {
    RRN: `RRN-${transaction.refNum}`,
    RefNum: transaction.refNum,
    MaskedPan: "603799****1234",
    HashedPan: "SIMULATOR",
    TerminalNumber: Number(transaction.terminalId),
    OrginalAmount: transaction.amount,
    AffectiveAmount: transaction.amount,
    StraceDate: new Date().toISOString().slice(0, 10).replace(/-/g, "/"),
    StraceNo: 12345,
  }
}

function callbackURL(transaction, scenario) {
  const callback = new URL(transaction.redirectURL)
  callback.searchParams.set("State", scenario.success ? "OK" : "Canceled")
  callback.searchParams.set("StateDescription", scenario.label)
  callback.searchParams.set("RefNum", transaction.refNum)
  callback.searchParams.set("ResNum", transaction.resNum)
  callback.searchParams.set("Token", transaction.token)
  return callback
}

function paymentPage(transaction) {
  const buttons = Object.entries(scenarios)
    .map(
      ([scenario, details]) =>
        `<form method="post" action="/OnlinePG/SendToken/${encodeURIComponent(
          transaction.token,
        )}/${encodeURIComponent(scenario)}"><button type="submit">${escapeHTML(
          details.label,
        )}</button></form>`,
    )
    .join("")

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>SEP Payment Simulator</title>
<style>body{font:16px system-ui,sans-serif;max-width:620px;margin:48px auto;padding:0 20px}main{border:1px solid #ddd;border-radius:8px;padding:24px}form{display:inline-block;margin:6px 6px 0 0}button{padding:10px 14px;cursor:pointer}</style>
</head><body><main><h1>SEP Payment Simulator</h1><p>No real payment will be made.</p>
<p><strong>Amount:</strong> ${escapeHTML(transaction.amount)}</p>
<p><strong>Reservation:</strong> ${escapeHTML(transaction.resNum)}</p>
<p>Select a result:</p>${buttons}</main></body></html>`
}

function readJSON(request) {
  return readBody(request).then((body) => {
    try {
      return JSON.parse(body || "{}")
    } catch (error) {
      throw error
    }
  })
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = ""
    request.on("data", (chunk) => (body += chunk))
    request.on("end", () => resolve(body))
    request.on("error", reject)
  })
}

function failureResponse(resultCode, resultDescription) {
  return {
    ResultCode: resultCode,
    ResultDescription: resultDescription,
    Success: false,
  }
}

function findTransaction(transactions, refNum) {
  return [...transactions.values()].find((item) => item.refNum === refNum)
}

async function handleRequest(request, response, transactions) {
  const requestURL = new URL(request.url, "http://localhost")

  if (request.method === "POST" && requestURL.pathname === "/onlinepg/OnlinePG") {
    const body = await readJSON(request)
    const token = `sim-token-${transactions.size + 1}`
    const transaction = {
      token,
      terminalId: body.TerminalId,
      amount: body.Amount,
      resNum: body.ResNum,
      redirectURL: body.RedirectUrl,
      sessionKey: body.TxnRandomSessionKey,
      refNum: `SIM-REF-${transactions.size + 1}`,
      scenario: "pending",
    }
    transactions.set(token, transaction)
    sendJSON(response, 200, { status: 1, token })
    return
  }

  if (request.method === "POST" && requestURL.pathname === "/OnlinePG/OnlinePG") {
    const body = new URLSearchParams(await readBody(request))
    const transaction = transactions.get(body.get("Token") || "")
    if (!transaction) {
      response.writeHead(404)
      response.end("Unknown token")
      return
    }
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" })
    response.end(paymentPage(transaction))
    return
  }

  const paymentMatch = requestURL.pathname.match(/^\/OnlinePG\/SendToken(?:\/(.+))?$/)
  if (request.method === "GET" && paymentMatch) {
    const token = paymentMatch[1] || requestURL.searchParams.get("token")
    const transaction = transactions.get(decodeURIComponent(token || ""))
    if (!transaction) {
      response.writeHead(404)
      response.end("Unknown token")
      return
    }
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" })
    response.end(paymentPage(transaction))
    return
  }

  const scenarioMatch = requestURL.pathname.match(
    /^\/OnlinePG\/SendToken\/([^/]+)\/([^/]+)$/,
  )
  if (request.method === "POST" && scenarioMatch) {
    const transaction = transactions.get(decodeURIComponent(scenarioMatch[1]))
    const scenario = scenarios[decodeURIComponent(scenarioMatch[2])]
    if (!transaction) {
      response.writeHead(404)
      response.end("Unknown token")
      return
    }
    if (!scenario) {
      response.writeHead(404)
      response.end("Unknown scenario")
      return
    }
    transaction.scenario = decodeURIComponent(scenarioMatch[2])
    response.writeHead(303, { location: callbackURL(transaction, scenario) })
    response.end()
    return
  }

  if (request.method === "POST" && requestURL.pathname.endsWith("/VerifyTranscation")) {
    const body = await readJSON(request)
    const transaction = findTransaction(transactions, body.refnum)
    if (!transaction) {
      sendJSON(response, 200, failureResponse(-1, "Unknown reference number"))
      return
    }
    if (
      transaction.sessionKey !== undefined &&
      transaction.sessionKey !== body.TxnRandomSessionKey
    ) {
      sendJSON(response, 200, failureResponse(-1, "Invalid session key"))
      return
    }
    if (transaction.scenario !== "success") {
      const scenario = scenarios[transaction.scenario]
      sendJSON(
        response,
        200,
        failureResponse(
          scenario ? scenario.resultCode : -1,
          scenario ? scenario.label : "Transaction was not successful",
        ),
      )
      return
    }
    sendJSON(response, 200, {
      ResultCode: 0,
      ResultDescription: "Success",
      Success: true,
      TransactionDetail: transactionDetail(transaction),
    })
    return
  }

  if (request.method === "POST" && requestURL.pathname.endsWith("/ReverseTransaction")) {
    const body = await readJSON(request)
    const transaction = findTransaction(transactions, body.RefNum)
    if (!transaction) {
      sendJSON(response, 200, failureResponse(-1, "Unknown reference number"))
      return
    }
    if (transaction.scenario === "reversed") {
      sendJSON(response, 200, failureResponse(2, "Transaction was already reversed"))
      return
    }
    if (transaction.scenario !== "success") {
      sendJSON(response, 200, failureResponse(-1, "Transaction cannot be reversed"))
      return
    }
    transaction.scenario = "reversed"
    sendJSON(response, 200, {
      ResultCode: 0,
      ResultDescription: "Success",
      Success: true,
      TransactionDetail: transactionDetail(transaction),
    })
    return
  }

  response.writeHead(404)
  response.end("Not found")
}

function createSimulatorServer() {
  const transactions = new Map()
  return http.createServer((request, response) => {
    handleRequest(request, response, transactions).catch(() =>
      sendJSON(response, 400, {
        status: -1,
        errorCode: 400,
        errorDesc: "Invalid request",
      }),
    )
  })
}

if (require.main === module) {
  const port = Number(process.env.SEP_SIMULATOR_PORT || 4100)
  const server = createSimulatorServer()
  server.listen(port, "127.0.0.1", () => {
    console.log(`SEP simulator listening at http://127.0.0.1:${port}`)
  })
}

module.exports = { createSimulatorServer, scenarios }