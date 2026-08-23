# تایید تراکنش

## مشخصات درخواست

|مورد|مقدار|
|---|---|
|روش|POST|
|آدرس|`https://sep.shaparak.ir/verifyTxnRandomSessionkey/ipg/VerifyTranscation`|
|نوع محتوا|`application/json`|

## مقادیر ارسالی

|عنوان|نوع|الزامی|توضیحات|نمونه|
|---|---|---|---|---|
|terminalnumber|number|*|شماره ترمینال فروشنده|1236548|
|refnum|string|*|شماره ارجاع پرداخت|REF-123|
|TxnRandomSessionKey|string||کلید تصادفی ارسال شده هنگام دریافت توکن|session-key|

## مقادیر دریافتی

پاسخ موفق شامل کد نتیجه، توضیح نتیجه، وضعیت موفقیت و جزئیات تراکنش است:

|عنوان|نوع|توضیحات|
|---|---|---|
|ResultCode|number|کد نتیجه تراکنش|
|ResultDescription|string|توضیح نتیجه|
|Success|boolean|وضعیت موفقیت تایید|
|TransactionDetail|object|جزئیات تراکنش در پاسخ موفق|

نمونه پاسخ موفق:

```json
{
	"ResultCode": 0,
	"ResultDescription": "Success",
	"Success": true,
	"TransactionDetail": {
		"RRN": "RRN-123",
		"RefNum": "REF-123",
		"MaskedPan": "603799****1234",
		"HashedPan": "HASHED_PAN",
		"TerminalNumber": 1236548,
		"OrginalAmount": 10000,
		"AffectiveAmount": 10000,
		"StraceDate": "2026/08/23",
		"StraceNo": 12345
	}
}
```

در کتابخانه، پاسخ های ناموفق یا تراکنش های قبلا تاییدشده با خطا رد می‌شوند. مقدار `TxnRandomSessionKey` باید همان مقداری باشد که هنگام دریافت token ارسال شده است.

## نمونه استفاده در TypeScript

```ts
const result = await sepGateway.verifyPayment(
	'REFERENCE_NUMBER',
	'session-key',
);

const success: boolean = result.getSuccess();
const resultCode: number = result.getResultCode();
const description: string = result.getResultDescription();
const transactionDetail = result.getTransactionDetail();
```