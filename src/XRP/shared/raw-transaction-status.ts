import { GetTransactionResponse } from '../Generated/web/org/xrpl/rpc/v1/get_transaction_pb'
import PaymentFlags from './payment-flags'
import { XrpError, XrpErrorType } from '.'

/** Abstraction around raw Transaction Status for compatibility. */
// TODO:(keefertaylor) This class is now defunct. Refactor and remove.
export default class RawTransactionStatus {
  /**
   * Create a RawTransactionStatus from a GetTransactionResponse protocol buffer.
   */
  static fromGetTransactionResponse(
    getTransactionResponse: GetTransactionResponse,
  ): RawTransactionStatus {
    const transaction = getTransactionResponse.getTransaction()
    if (!transaction) {
      throw new XrpError(
        XrpErrorType.MalformedResponse,
        'Malformed input, `getTxResponse` did not contain a transaction.',
      )
    }

    const transactionResultCode = getTransactionResponse
      .getMeta()
      ?.getTransactionResult()
      ?.getResult()
    if (!transactionResultCode) {
      throw new XrpError(
        XrpErrorType.MalformedResponse,
        'Malformed input, `getTxResponse` did not contain a transaction result code.',
      )
    }
    const isPayment = transaction.hasPayment()
    const flags = transaction.getFlags()?.getValue() ?? 0

    const isPartialPayment = PaymentFlags.checkFlag(
      PaymentFlags.TF_PARTIAL_PAYMENT,
      flags,
    )

    const isFullPayment = isPayment && !isPartialPayment

    return new RawTransactionStatus(
      getTransactionResponse.getValidated(),
      transactionResultCode,
      getTransactionResponse
        .getTransaction()
        ?.getLastLedgerSequence()
        ?.getValue(),
      isFullPayment,
    )
  }

  /**
   * Note: This constructor is exposed for testing purposes. Clients of this code should favor using a static factory method.
   */
  constructor(
    public isValidated: boolean,
    public transactionStatusCode: string,
    public lastLedgerSequence: number | undefined,
    public isFullPayment: boolean,
  ) {}
}
