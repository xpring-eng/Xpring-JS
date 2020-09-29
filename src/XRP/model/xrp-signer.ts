import { XrpError, XrpErrorType } from '..'
import { XrplNetwork } from 'xpring-common-js'
import XrpUtils from '../xrp-utils'
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
  public static from(signer: Signer, xrplNetwork: XrplNetwork): XrpSigner {
    const account = signer.getAccount()?.getValue()?.getAddress()
    if (!account) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Signer protobuf is missing `account` field.',
      )
    }
    const accountXAddress = XrpUtils.encodeXAddress(
      account,
      undefined,
      xrplNetwork == XrplNetwork.Test || xrplNetwork == XrplNetwork.Dev,
    )
    if (!accountXAddress) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Cannot construct XAddress from Signer protobuf `account` field.',
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
        'Signer protobuf is missing `TransactionSignature` field.',
      )
    }
    return new XrpSigner(
      accountXAddress,
      signingPublicKey,
      transactionSignature,
    )
  }

  /**
   * @param accountXAddress The address associated with this signature, as it appears in the SignerList, encoded as an
   *                X-address (see https://xrpaddress.info/).
   * @param signingPublicKey The public key used to create this signature.
   * @param transactionSignature A signature for this transaction, verifiable using the SigningPubKey.
   */
  private constructor(
    readonly accountXAddress: string,
    readonly signingPublicKey: Uint8Array,
    readonly transactionSignature: Uint8Array,
  ) {}
}
