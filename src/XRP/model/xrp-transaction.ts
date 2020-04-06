import { Transaction } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import RippledFlags from '../rippled-flags'
import XRPSigner from './xrp-signer'
import XRPTransactionType from './xrp-transaction-type'
import XRPPayment from './xrp-payment'
import XRPMemo from './xrp-memo'

/*
 * A transaction on the XRP Ledger.
 *
 * @see: https://xrpl.org/transaction-formats.html
 */
// TODO(amiecorso): Modify this object to use X-Address format.
export default class XRPTransaction {
  public static from(transaction: Transaction): XRPTransaction | undefined {
    const account = transaction.getAccount()?.getValue()?.getAddress()

    const fee = transaction.getFee()?.getDrops()

    const sequence = transaction.getSequence()?.getValue()

    const signingPublicKey = transaction.getSigningPublicKey()?.getValue_asU8()

    const transactionSignature = transaction
      .getTransactionSignature()
      ?.getValue_asU8()

    const accountTransactionID = transaction
      .getAccountTransactionId()
      ?.getValue_asU8()

    const flags = transaction.getFlags()?.getValue()

    const lastLedgerSequence = transaction.getLastLedgerSequence()?.getValue()

    let memos
    if (transaction.getMemosList().length > 0) {
      memos = transaction.getMemosList().map((memo) => XRPMemo.from(memo))
    }

    let signers
    if (transaction.getSignersList().length > 0) {
      signers = transaction
        .getSignersList()
        .map((signer) => XRPSigner.from(signer))
    }

    const sourceTag = transaction.getSourceTag()?.getValue()

    let paymentFields
    let type
    switch (transaction.getTransactionDataCase()) {
      case Transaction.TransactionDataCase.PAYMENT: {
        const payment = transaction.getPayment()
        if (!payment) {
          return undefined
        }
        paymentFields = payment && XRPPayment.from(payment)
        if (!paymentFields) {
          return undefined
        }
        type = payment && Transaction.TransactionDataCase.PAYMENT
        break
      }
      default:
        // Unsupported transaction type.
        return undefined
    }

    return new XRPTransaction(
      account,
      accountTransactionID,
      fee,
      flags,
      lastLedgerSequence,
      memos,
      sequence,
      signers,
      signingPublicKey,
      sourceTag,
      transactionSignature,
      type,
      paymentFields,
    )
  }

  private constructor(
    readonly account?: string,
    readonly accountTransactionID?: Uint8Array,
    readonly fee?: string,
    readonly flags?: RippledFlags,
    readonly lastLedgerSequence?: number,
    readonly memos?: Array<XRPMemo>,
    readonly sequence?: number,
    readonly signers?: Array<XRPSigner>,
    readonly signingPublicKey?: Uint8Array,
    readonly sourceTag?: number,
    readonly transactionSignature?: Uint8Array,
    readonly type?: XRPTransactionType,
    readonly paymentFields?: XRPPayment,
  ) {}
}
