const fs = require("fs")
const path = require("path")
const { execFileSync, spawn } = require("child_process")

const packageJSON = require("../package.json")

function waitForOutput(child, pattern) {
  return new Promise((resolve, reject) => {
    let output = ""
    const onData = (chunk) => {
      output += chunk.toString()
      if (pattern.test(output)) {
        cleanup()
        resolve(output)
      }
    }
    const onExit = (code, signal) => {
      cleanup()
      reject(
        new Error(
          `CLI exited before startup (code ${code}, signal ${signal}): ${output}`,
        ),
      )
    }
    const cleanup = () => {
      child.stdout.off("data", onData)
      child.stderr.off("data", onData)
      child.off("exit", onExit)
    }

    child.stdout.on("data", onData)
    child.stderr.on("data", onData)
    child.on("exit", onExit)
  })
}

describe("simulator CLI", () => {
  it("publishes an executable bin entry and includes the CLI file", () => {
    const cliPath = path.resolve(
      __dirname,
      "..",
      packageJSON.bin["sep-payment-gateway-simulator"],
    )
    expect(packageJSON.bin["sep-payment-gateway-simulator"]).toBe(
      "./simulator/cli.js",
    )
    expect(fs.readFileSync(cliPath, "utf8")).toMatch(/^#!\/usr\/bin\/env node/)
  })

  it("starts on SEP_SIMULATOR_PORT and shuts down gracefully", async () => {
    const cliPath = path.resolve(__dirname, "..", "simulator", "cli.js")
    const child = spawn(process.execPath, [cliPath], {
      env: { ...process.env, SEP_SIMULATOR_PORT: "0" },
      stdio: ["ignore", "pipe", "pipe"],
    })

    try {
      const output = await waitForOutput(
        child,
        /listening at http:\/\/127\.0\.0\.1:(\d+)/,
      )
      const port = output.match(/listening at http:\/\/127\.0\.0\.1:(\d+)/)[1]
      expect(Number(port)).toBeGreaterThan(0)
      expect(output).toContain("SEP simulator listening")
    } finally {
      if (child.exitCode === null) {
        if (process.platform === "win32") {
          execFileSync("taskkill", ["/pid", String(child.pid), "/t", "/f"])
        } else {
          child.kill("SIGTERM")
        }
      }
    }
  })
})
