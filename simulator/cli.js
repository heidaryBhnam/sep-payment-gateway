#!/usr/bin/env node

const { createSimulatorServer } = require("./server")

const configuredPort = process.env.SEP_SIMULATOR_PORT || "4100"
const port = Number(configuredPort)

if (!Number.isInteger(port) || port < 0 || port > 65535) {
  console.error(
    `SEP simulator could not start: SEP_SIMULATOR_PORT must be an integer between 0 and 65535 (received "${configuredPort}")`,
  )
  process.exitCode = 1
} else {
  const server = createSimulatorServer()
  let shuttingDown = false

  function shutdown(signal) {
    if (shuttingDown) return
    shuttingDown = true
    console.log(`SEP simulator shutting down after ${signal}`)
    server.close((error) => {
      if (error) {
        console.error(`SEP simulator shutdown failed: ${error.message}`)
        process.exit(1)
      }
      process.exit(0)
    })
  }

  process.on("SIGINT", () => shutdown("SIGINT"))
  process.on("SIGTERM", () => shutdown("SIGTERM"))
  server.on("error", (error) => {
    console.error(`SEP simulator failed to start: ${error.message}`)
    process.exitCode = 1
  })
  server.listen(port, "127.0.0.1", () => {
    const address = server.address()
    const actualPort = typeof address === "object" && address ? address.port : port
    console.log(`SEP simulator listening at http://127.0.0.1:${actualPort}`)
  })
}