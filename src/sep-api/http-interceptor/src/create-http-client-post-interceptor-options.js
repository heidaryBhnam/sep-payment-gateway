module.exports = function buildCreateHttpClientPostInterceptorOptions() {
  return function createHttpClientPostInterceptorOptions({ jsonData }) {
    if (!jsonData)
      throw new Error(
        "createHttpClientPostInterceptorOptions must have jsonData.",
      )

    const body = JSON.stringify(jsonData)

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    const result = { body: body, headers: headers }

    return result
  }
}
