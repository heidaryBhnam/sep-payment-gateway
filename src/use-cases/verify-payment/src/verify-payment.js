module.exports = function buildVerifyPayment
(
    verifyPaymentApi
)
    {
        if
        (
            !verifyPaymentApi
        )
            {
                throw new Error('buildVerifyPayment must have verifyPaymentApi.');
            }

        return async function verifyPayment(RefNum, TxnRandomSessionKey) {
          if (!RefNum) {
            throw new Error("verifyPayment must have RefNum.")
          }

          const { TransactionDetail, ResultCode, ResultDescription, Success } =
            await verifyPaymentApi(RefNum, TxnRandomSessionKey)

          const result = Object.freeze({
            getTransactionDetail: () => TransactionDetail,
            getResultCode: () => ResultCode,
            getResultDescription: () => ResultDescription,
            getSuccess: () => Success,
          })

          return result
        }
    }