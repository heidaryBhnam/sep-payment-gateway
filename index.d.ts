export interface GatewayOptions {
  SEP_TERMINAL_ID: string | number
  customizedHTTPPostMethod?: HTTPPostMethod
  /** Use SEP's test host instead of the production host. */
  isOnDevelop?: boolean
}

export interface HTTPPostRequest {
    hostname: string;
    path: string;
    headers: Record<string, string | number>;
    body: string;
}

export interface HTTPPostResponse {
    headers: Record<string, string | string[] | undefined>;
    data: string;
}

export type HTTPPostMethod = (
    request: HTTPPostRequest
) => Promise<HTTPPostResponse>;

export interface InvoiceOptions {
  Amount: number
  ResNum: string
  RedirectURL: string
  Wage?: number
  CellNumber?: string
  TokenExpiryInMin?: number
  TxnRandomSessionKey?: string
  TranType?: string
  SettlementIbanInfo?: SettlementIban[]
}

export interface SettlementIban {
  IBAN: string
  Amount: number
  PurchaseId: string
}

export interface Invoice {
  getAmount(): number
  getResNum(): string
  getRedirectURL(): string
  getWage(): number | undefined
  getCellNumber(): string | undefined
  getTokenExpiryInMin(): number
  getTxnRandomSessionKey(): string | undefined
  getTranType(): string | undefined
  getSettlementIbanInfo(): SettlementIban[] | undefined
}

export interface RefNumOptions {
  refNumValue: string
}

export interface RefNum {
  getRefNum(): string
}

export interface Payment {
  getPaymentUrl(): string
  getPaymentRedirectHTMLPage(): string
  getStatus(): number
  getToken(): string
}

export interface TransactionDetail {
  RRN: string
  RefNum: string
  MaskedPan: string
  HashedPan: string
  TerminalNumber: string | number
  OrginalAmount: number
  AffectiveAmount: number
  StraceDate: string
  StraceNo: string | number
}

export interface TransactionResult {
  getTransactionDetail(): TransactionDetail
  getResultCode(): number
  getResultDescription(): string
  getSuccess(): boolean
}

export interface PaymentGateway {
  makeInvoice(options: InvoiceOptions): Invoice
  makeRefNum(options: RefNumOptions): RefNum
  makeTransactionDetail(options: TransactionDetail): void
  createPayment(invoice: Invoice): Promise<Payment>
  verifyPayment(
    refNum: string,
    txnRandomSessionKey?: string,
  ): Promise<TransactionResult>
  reversePayment(refNum: string): Promise<TransactionResult>
}

declare function createSepPaymentGateway(options: GatewayOptions): PaymentGateway;

export = createSepPaymentGateway;