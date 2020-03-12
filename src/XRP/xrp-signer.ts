import { Signer } from '../generated/web/org/xrpl/rpc/v1/transaction_pb'

/*
 * Represents a signer of a transaction on the XRP Ledger.
 * @see: https://xrpl.org/transaction-common-fields.html#signers-field
 */
export default class XRPSigner {
  public static from(signer: Signer): XRPSigner | undefined {
    const account = signer
      .getAccount()
      ?.getValue()
      ?.getAddress()
    const signingPublicKey = signer.getSigningPublicKey()?.getValue()
    const transactionSignature = signer.getTransactionSignature()?.getValue()
    return new XRPSigner(account, signingPublicKey, transactionSignature)
  }

  private constructor(
    readonly account?: string,
    readonly signingPublicKey?: Uint8Array | string,
    readonly transactionSignature?: Uint8Array | string,
  ) {}
}
