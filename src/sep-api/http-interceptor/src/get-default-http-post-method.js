module.exports = function buildGetDefaultHTTPPostMethod() {
  const https = require("https")
  const requestTimeoutMs = 10000
  const maxResponseBytes = 1024 * 1024

  if (!https)
    throw new Error(
      `Your node version doese'nt support https module. create a custome http post client method`,
    )

  return function getDefaultHTTPPostMethod() {
    return async function ({ hostname, path, headers, body }) {
      if (!hostname) throw new Error(`http post request must have hostname`)
      if (!path) throw new Error(`http post request must have path`)
      if (!headers) throw new Error(`http post request must have headers`)
      if (!body) throw new Error(`http post request must have body`)

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: body,
        hostname: hostname,
        path: path,
      }

      return new Promise((resolve, reject) => {
        const req = https.request(requestOptions, (res) => {
          let data = ""
          let responseBytes = 0

          res.on("data", (chunk) => {
            responseBytes += Buffer.byteLength(chunk)

            if (responseBytes > maxResponseBytes) {
              req.destroy(new Error("HTTP response exceeds the allowed size."))
              return
            }

            data += chunk
          })

          res.on("end", () => {
            const result = { headers: res.headers, data: data }
            resolve(result)
          })

          res.on("error", reject)
        })

        req.on("error", reject)
        req.setTimeout(requestTimeoutMs, () => {
          req.destroy(new Error("HTTP request timed out."))
        })
        req.write(body)
        req.end()
      })
    }
  }
}
