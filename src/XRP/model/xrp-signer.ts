import { XrpError, XrpErrorType } from '..'
import { Signer } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'

/*
 * Represents a signer of a transaction on the XRP Ledger.
 * @see: https://xrpl.org/transaction-common-fields.html#signers-field
 */
export default class XrpSigner {
  /**
   * Constructs an XrpSigner from a Signer.
   *
   * @param signer a Signer (protobuf object) whose field values will be used
   *               to construct an XrpSigner
   * @return an XrpSigner with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/develop/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L90
   */
  public static from(signer: Signer): XrpSigner | undefined {
    const account = signer.getAccount()?.getValue()?.getAddress()
    if (!account) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Signer protobuf is missing `account` field.',
      )
    }
    const signingPublicKey = signer.getSigningPublicKey()?.getValue_asU8()
    if (!signingPublicKey) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Signer protobuf is missing `SigningPublicKey` field.',
      )
    }
    const transactionSignature = signer
      .getTransactionSignature()
      ?.getValue_asU8()
    if (!transactionSignature) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Signer protobuf is missing `TnxSignature` field.',
      )
    }
    return new XrpSigner(account, signingPublicKey, transactionSignature)
  }

  /**
   * @param account The address associated with this signature, as it appears in the SignerList.
   * @param signingPublicKey The public key used to create this signature.
   * @param transactionSignature A signature for this transaction, verifiable using the SigningPubKey.
   */
  private constructor(
    readonly account?: string,
    readonly signingPublicKey?: Uint8Array,
    readonly transactionSignature?: Uint8Array,
  ) {}
}
