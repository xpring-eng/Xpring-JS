/** Re-exports from xpring-common-js. */
export {
  ClassicAddress,
  PayIdUtils,
  Wallet,
  WalletFactory,
  WalletGenerationResult,
  Utils,
  XrplNetwork,
} from 'xpring-common-js'

/** XRP Functionality. */
export {
  XrpClient,
  IssuedCurrencyClient,
  TrustLine,
  GatewayBalances,
} from './XRP'
// export { IssuedCurrency } from './XRP'
export {
  XrpCurrencyAmount,
  XrpCurrency,
  XrplIssuedCurrency,
  XrpMemo,
  XrpPathElement,
  XrpPath,
  XrpPayment,
  XrpSigner,
  XrpTransaction,
} from './XRP/protobuf-wrappers'
export {
  AccountSetFlag,
  AccountRootFlag,
  PaymentFlag,
  SendXrpDetails,
  TransactionResult,
  TransactionStatus,
  XrpError,
  XrpTransactionType,
  XrpUtils,
} from './XRP/shared'
export { default as XrpPayIdClient } from './PayID/xrp-pay-id-client'

/** PayID Functionality. */
export { PayIdErrorType, default as PayIdError } from './PayID/pay-id-error'
export { default as PayIdClient } from './PayID/pay-id-client'

/** ILP Functionality. */
export { PaymentRequest, PaymentResult, AccountBalance, IlpClient } from './ILP'
export { default as IlpError, IlpErrorType } from './ILP/ilp-error'

/** Xpring Functionality. */
export { default as XpringClient } from './Xpring/xpring-client'

/** IOU Functionality. */
export { default as IssuedCurrencyClient } from './XRP/issued-currency-client'

export { default as XRPTestUtils } from '../test/XRP/helpers/xrp-test-utils'
