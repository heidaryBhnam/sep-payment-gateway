module.exports = async function translateHttpClientPostInterceptorResponse({
  httpResponse,
}) {
  if (!httpResponse)
    throw new Error(
      "translateHttpClientPostInterceptorResponse must have httpResponse.",
    )
  else if (!httpResponse.headers)
    throw new Error(
      "translateHttpClientPostInterceptorResponse response must have headers.",
    )

  const contentTypeHeader = httpResponse.headers["content-type"]
  const contentType = Array.isArray(contentTypeHeader)
    ? contentTypeHeader.join(",")
    : contentTypeHeader

  if (typeof contentType !== "string")
    throw new Error(
      "translateHttpClientPostInterceptorResponse response must have a valid content-type header.",
    )

  if (typeof httpResponse.data !== "string")
    throw new Error(
      "translateHttpClientPostInterceptorResponse response must have string data.",
    )

  // check if the response is from SEP servers
  if (contentType.toLowerCase().includes("json")) {
    let jsonData

    try {
      jsonData = JSON.parse(httpResponse.data)
    } catch {
      throw new Error(
        "translateHttpClientPostInterceptorResponse received invalid JSON.",
      )
    }

    const headers = httpResponse.headers
    const result = { headers: headers, jsonData: jsonData }

    return result
  } else if (contentType.toLowerCase().includes("text/html"))
    throw new Error("translateHttpClientPostInterceptorResponse received HTML.")
  else
    throw new Error(
      `translateHttpClientPostInterceptorResponse Error | unknown content-type response | ${contentType}`,
    )
}
