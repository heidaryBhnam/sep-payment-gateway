# اصلاحیه تراکنش

> توجه: در مجموعه مستندات SEP نسخه 3.6 بارگذاری شده در این پروژه، درخواست اصلاح تراکنش تعریف نشده است. پیاده سازی فعلی این عملیات تا دریافت مستندات رسمی مربوط به آن بدون تغییر باقی میماند.

## قرارداد فعلی کتابخانه

این عملیات در مجموعه مستندات SEP نسخه 3.6 موجود در پروژه تعریف نشده است. کتابخانه فعلا درخواست قبلی خود را به آدرس زیر ارسال می‌کند:

|مورد|مقدار|
|---|---|
|روش|POST|
|آدرس|`https://sep.shaparak.ir/verifyTxnRandomSessionkey/ipg/ReverseTransaction`|
|نوع محتوا|`application/json`|
|بدنه فعلی|`{ "RefNum": "REFERENCE_NUMBER" }`|

این قرارداد باید قبل از استفاده در محیط عملیاتی با مستندات رسمی SEP تایید شود.

## مقادیر ارسالی

|عنوان|نوع|الزامی|توضیحات|نمونه|
|---|---|---|---|---|
|RefNum|string|*|شماره ارجاع پرداخت برای برگشت تراکنش|REF-123|

## مقادیر دریافتی

پیاده‌سازی فعلی انتظار دارد پاسخ شامل فیلدهای زیر باشد:

|عنوان|نوع|توضیحات|
|---|---|---|
|ResultCode|number|کد نتیجه عملیات|
|ResultDescription|string|توضیح نتیجه|
|Success|boolean|وضعیت موفقیت عملیات|
|TransactionDetail|object|جزئیات تراکنش در پاسخ موفق|

پاسخ های ناموفق توسط کتابخانه با خطا رد می‌شوند. این جدول قرارداد فعلی کد است و سند رسمی SEP نسخه 3.6 محسوب نمی‌شود.

## نمونه استفاده در TypeScript

```ts
const result = await sepGateway.reversePayment('REFERENCE_NUMBER');

const success: boolean = result.getSuccess();
const resultCode: number = result.getResultCode();
const description: string = result.getResultDescription();
const transactionDetail = result.getTransactionDetail();
```