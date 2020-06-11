import { Utils } from 'xpring-common-js'
import { Transaction } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import RippledFlags from '../rippled-flags'
import XRPSigner from './xrp-signer'
import XRPTransactionType from './xrp-transaction-type'
import XRPPayment from './xrp-payment'
import XRPMemo from './xrp-memo'
import { GetTransactionResponse } from '../Generated/web/org/xrpl/rpc/v1/get_transaction_pb'
import XRPLNetwork from '../../Common/xrpl-network'

/*
 * A transaction on the XRP Ledger.
 *
 * @see: https://xrpl.org/transaction-formats.html
 */
export default class XRPTransaction {
  /**
   * Constructs an XRPTransaction from a Transaction.
   *
   * @param transaction a Transaction (protobuf object) whose field values will be used
   *                    to construct an XRPTransaction
   * @param xrplNetwork The XRPL network from which this object was retrieved.
   * @returns an XRPTransaction with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/develop/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L13
   */
  public static from(
    getTransactionResponse: GetTransactionResponse,
    xrplNetwork: XRPLNetwork,
  ): XRPTransaction | undefined {
    const transaction = getTransactionResponse.getTransaction()
    if (!transaction) {
      return undefined
    }

    const account = transaction.getAccount()?.getValue()?.getAddress()
    if (!account) {
      return undefined
    }

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

    const sourceXAddress = Utils.encodeXAddress(
      account,
      sourceTag,
      xrplNetwork === XRPLNetwork.Test,
    )

    let paymentFields
    let type
    switch (transaction.getTransactionDataCase()) {
      case Transaction.TransactionDataCase.PAYMENT: {
        const payment = transaction.getPayment()
        if (!payment) {
          return undefined
        }
        paymentFields = payment && XRPPayment.from(payment, xrplNetwork)
        if (!paymentFields) {
          return undefined
        }
        type = payment && XRPTransactionType.Payment
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

    const deliveredAmountProto = getTransactionResponse
      .getMeta()
      ?.getDeliveredAmount()

    const deliveredAmountXRP = deliveredAmountProto
      ?.getValue()
      ?.getXrpAmount()
      ?.getDrops()

    const deliveredAmountIssuedCurrency = deliveredAmountProto
      ?.getValue()
      ?.getIssuedCurrencyAmount()
      ?.getValue()

    const deliveredAmount = deliveredAmountXRP ?? deliveredAmountIssuedCurrency

    const validated = getTransactionResponse.getValidated()

    const ledgerIndex = getTransactionResponse.getLedgerIndex()

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
      sourceXAddress,
      transactionSignature,
      type,
      paymentFields,
      timestamp,
      deliveredAmount,
      validated,
      ledgerIndex,
    )
  }

  /**
   * @param hash The identifying hash of the transaction.
   * @deprecated @param account Deprecated, please use sourceXAddress. The unique address of the account that initiated the transaction.
   * @param accountTransactionID (Optional) Hash value identifying another transaction.
   *                              If provided, this transaction is only valid if the sending account's
   *                              previously-sent transaction matches the provided hash.
   * @param fee Integer amount of XRP, in drops, to be destroyed as a cost for distributing this transaction to the network.
   * @param flags (Optional) Set of bit-flags for this transaction.
   * @param lastLedgerSequence (Optional; strongly recommended) Highest ledger index this transaction can appear in.
   *                            Specifying this field places a strict upper limit on how long the transaction can wait to be
   *                            validated or rejected.
   * @param memos (Optional) Additional arbitrary information used to identify this transaction.
   * @param sequence The sequence number of the account sending the transaction. A transaction is only valid if the Sequence
   *                  number is exactly 1 greater than the previous transaction from the same account.
   * @param signers (Optional) Array of objects that represent a multi-signature which authorizes this transaction.
   * @param signingPublicKey Hex representation of the public key that corresponds to the private key used to sign this transaction.
   *                         If an empty string, indicates a multi-signature is present in the Signers field instead.
   * @deprecated @param sourceTag Deprecated, please use sourceXAddress. (Optional) Arbitrary integer used to identify the reason for
   *                              this payment or a sender on whose behalf this transaction is made.
   *                  Conventionally, a refund should specify the initial payment's SourceTag as the refund payment's DestinationTag.
   * @param sourceXAddress: The unique address and source tag of the sender that initiated the transaction, encoded as an X-address.
   *                        See "https://xrpaddress.info"
   * @param transactionSignature The signature that verifies this transaction as originating from the account it says it is from.
   * @param type The type of transaction.
   * @param paymentFields An XRPPayment object representing the additional fields present in a PAYMENT transaction.
   *                      See "https://xrpl.org/payment.html#payment-fields"
   * @param deliveredAmount The actual amount delivered by this transaction, in the case of a partial payment.
   *                        See "https://xrpl.org/partial-payments.html#the-delivered_amount-field"
   * @param timestamp The transaction's timestamp, converted to a unix timestamp.
   * @param validated A boolean indicating whether or not this transaction was found on a validated ledger, and not an open or closed ledger.
   *                  See "https://xrpl.org/ledgers.html#open-closed-and-validated-ledgers"
   * @param ledgerIndex The index of the ledger on which this transaction was found.
   */
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
    readonly sourceXAddress?: string,
    readonly transactionSignature?: Uint8Array,
    readonly type?: XRPTransactionType,
    readonly paymentFields?: XRPPayment,
    readonly timestamp?: number,
    readonly deliveredAmount?: string,
    readonly validated?: boolean,
    readonly ledgerIndex?: number,
  ) {}
}
