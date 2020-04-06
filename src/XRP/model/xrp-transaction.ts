import { Utils } from 'xpring-common-js'
import { Transaction } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import RippledFlags from '../rippled-flags'
import XRPSigner from './xrp-signer'
import XRPTransactionType from './xrp-transaction-type'
import XRPPayment from './xrp-payment'
import XRPMemo from './xrp-memo'
import { GetTransactionResponse } from '../Generated/web/org/xrpl/rpc/v1/get_transaction_pb'

/*
 * A transaction on the XRP Ledger.
 *
 * @see: https://xrpl.org/transaction-formats.html
 */
// TODO(amiecorso): Modify this object to use X-Address format.
export default class XRPTransaction {
<<<<<<< HEAD
  public static from(transaction: Transaction): XRPTransaction | undefined {
    const account = transaction.getAccount()?.getValue()?.getAddress()
=======
  public static from(
    getTransactionResponse: GetTransactionResponse,
  ): XRPTransaction | undefined {
    const transaction = getTransactionResponse.getTransaction()
    if (!transaction) {
      return undefined
    }

    const account = transaction
      .getAccount()
      ?.getValue()
      ?.getAddress()
>>>>>>> origin/master

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

    const transactionHashBytes = getTransactionResponse.getHash_asU8()
    if (!transactionHashBytes) {
      return undefined
    }
    const transactionHash = Utils.toHex(transactionHashBytes)

    // Transactions report their timestamps since the Ripple Epoch, which is 946,684,800 seconds after
    // the unix epoch. Convert transaction's timestamp to a unix timestamp.
    // See: https://xrpl.org/basic-data-types.html#specifying-time
    const rippleTransactionDate = getTransactionResponse.getDate()?.getValue()
    const timestamp =
      rippleTransactionDate !== undefined
        ? rippleTransactionDate + 946684800
        : undefined

    return new XRPTransaction(
      transactionHash,
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
      timestamp,
    )
  }

  private constructor(
    readonly hash: string,
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
    readonly timestamp?: number,
  ) {}
}
