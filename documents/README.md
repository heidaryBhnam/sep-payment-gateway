# مستندات

نسخه فعلی پکیج: `1.1.1`

- [ایجاد پرداخت](getToken.md)
- [تایید پرداخت](VerifyTransaction.md)
- [اصلاح تراکنش](ReverseTransaction.md)

> توجه: مجموعه مستندات SEP نسخه 3.6 موجود در این پوشه فقط درخواست های دریافت توکن و تایید تراکنش را تعریف میکند و درخواست اصلاح تراکنش در آن وجود ندارد. بنابراین `reversePayment` تا دریافت مستندات رسمی این endpoint به صورت جداگانه، با قرارداد قبلی باقی میماند.

## استفاده در TypeScript

پکیج شامل تعریف های TypeScript است و نیازی به نصب پکیج جداگانه برای type declaration نیست:

```bash
npm install sep-payment-gateway-next
```

به دلیل استفاده پکیج از خروجی CommonJS، gateway را به شکل زیر import کنید:

```ts
import createSepPaymentGateway = require('sep-payment-gateway-next');

const sepGateway = createSepPaymentGateway({
	SEP_TERMINAL_ID: process.env.SEP_TERMINAL_ID as string,
});
```

متدهای `makeInvoice`، `createPayment`، `verifyPayment` و `reversePayment` دارای type هستند.

در نسخه فعلی، token پرداخت در HTML به صورت امن escape و در URL encode می‌شود. درخواست‌های HTTPS داخلی دارای timeout ده ثانیه و محدودیت پاسخ یک مگابایت هستند؛ پاسخ JSON نامعتبر یا بدون `content-type` نیز رد می‌شود.