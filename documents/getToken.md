# ایجاد پرداخت

## مشخصات درخواست

|مورد|مقدار|
|---|---|
|روش|POST|
|آدرس|`https://sep.shaparak.ir/onlinepg/OnlinePG`|
|نوع محتوا|`application/json`|

## مقادیر ارسالی 

|عنوان|نوع|الزامی|توضیحات|نمونه|
|---|---|---|---|---|
|TerminalId|string|*| شماره ترمینال فروشنده است که برای شناسایی فروشنده در هر تراکنش لازم است.|1236548|
|Action|string|*|برای دریافت توکن مقدار آن باید Token قرار داده شود.|Token|
|Amount|number|*|مبلغ خرید است که فروشنده می خواهد از خریدار دریافت نماید. این اطلاعات باید به صورت یک عدد صحیح باشد و از هرگونه کاراکتر غیر عددی پرهیز شود|10000|
|ResNum|string|*|شماره  یکتایی  که  باید  از  طرف  فروشنده  به  ازای  هر  تراکنش  خرید  به  پرداخت الکترونیک سامان کیش  اعلام شود. تا از تکرار بی مورد پرداخت جلوگیری و قابلیت  استعلام را نیز داشته باشد.|r4T5ER|
|RedirectUrl|string|*| آدرس بازگشت از صفحه ی پرداخت داخل شاپرک|http://my_specific.site/reciept|
|CellNumber|string||این مقدار بدون صفر اول ارسال میشود. شماره موبایل کاربر (خریدار   –  دارنده ی کارت) جهت بازیابی و یا ذخیره  سازی اطلاعات کارت   در صورتی که با این شماره موبایل اطلاعات کارتی در دیتابیس پرداخت الکترونیک امان موجود  باشد، خریدار لیستی از کارت ها را خواهد دید و با انتخاب هر کدام اطلاعات شماره ارت  و تاریخ انقضا در فیلد های مرتبط پر خواهند شد.|912222222|
|TxnRandomSessionKey|string||کلید تصادفی برای بررسی تراکنش در مرحله تایید|session-key|
|TranType|string||نوع تراکنش دولتی|Government|
|SettlementIbanInfo|array||اطلاعات تسویه شامل IBAN، مبلغ و PurchaseId|[{ IBAN, Amount, PurchaseId }]|

## مقادیر دریافتی

### پاسخ موفق

در پاسخ موفق، `status` برابر `1` است و token پرداخت در فیلد `token` برگردانده می‌شود:

```json
{
	"status": 1,
	"token": "PAYMENT_TOKEN"
}
```

### پاسخ خطا

در پاسخ خطا، `status` برابر `-1` است. کد و توضیح خطا در `errorCode` و `errorDesc` قرار دارند:

```json
{
	"status": -1,
	"errorCode": 100,
	"errorDesc": "ERROR_DESCRIPTION"
}
```

پس از دریافت token، از `payment.getPaymentUrl()` یا `payment.getPaymentRedirectHTMLPage()` برای ارسال کاربر به درگاه استفاده کنید. token را در لاگ یا پاسخ عمومی برنامه ذخیره و نمایش ندهید.

## نمونه استفاده در TypeScript

```ts
const invoice = sepGateway.makeInvoice({
	Amount: 10000,
	ResNum: 'TS_PAYMENT_001',
	RedirectURL: 'https://example.com/payment/callback',
	CellNumber: '912222222',
	TxnRandomSessionKey: 'session-key',
	TranType: 'Government',
});

const payment = await sepGateway.createPayment(invoice);
const paymentUrl = payment.getPaymentUrl();
const redirectHtml = payment.getPaymentRedirectHTMLPage();
```