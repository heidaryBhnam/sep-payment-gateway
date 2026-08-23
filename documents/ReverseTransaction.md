# اصلاحیه تراکنش

> توجه: در مجموعه مستندات SEP نسخه 3.6 بارگذاری شده در این پروژه، درخواست اصلاح تراکنش تعریف نشده است. پیاده سازی فعلی این عملیات تا دریافت مستندات رسمی مربوط به آن بدون تغییر باقی میماند.

## مقادیر ارسالی 

## مقادیر دریافتی

## نمونه استفاده در TypeScript

```ts
const result = await sepGateway.reversePayment('REFERENCE_NUMBER');

const success: boolean = result.getSuccess();
const resultCode: number = result.getResultCode();
const description: string = result.getResultDescription();
const transactionDetail = result.getTransactionDetail();
```