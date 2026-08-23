module.exports = function buildGetPaymentRedirectHTMLPage(token) {
  if (!token) throw new Error("getPaymentRedirectHTMLPage must have token.")

  return function getPaymentRedirectHTMLPage() {
    const escapedToken = String(token).replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }

      return entities[character]
    })

    const htmlContent = `<form onload="document.forms['forms'].submit()" action="https://sep.shaparak.ir/OnlinePG/OnlinePG" method="post"><input type="hidden" name="Token" value="${escapedToken}" /><input name="GetMethod" type="text" value="true"></form>`

    return htmlContent
  }
}
