# تایید تراکنش

## مقادیر ارسالی

|عنوان|نوع|الزامی|توضیحات|نمونه|
|---|---|---|---|---|
|terminalnumber|number|*|شماره ترمینال فروشنده|1236548|
|refnum|string|*|شماره ارجاع پرداخت|REF-123|
|TxnRandomSessionKey|string||کلید تصادفی ارسال شده هنگام دریافت توکن|session-key|

## مقادیر دریافتی

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