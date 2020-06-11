import { SignerListSet } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import XRPSignerEntry from './xrp-signer-entry'
/*
 * Represents a SignerListSet transaction on the XRP Ledger.
 *
 * A SignerListSet transaction creates, replaces, or removes a list of signers that can be used to multi-sign a
 * transaction. This transaction type was introduced by the MultiSign amendment.
 *
 * @see: https://xrpl.org/signerlistset.html
 */
export default class XrpSignerListSet {
  /**
   * Constructs an XrpSignerListSet from a SignerListSet protocol buffer.
   *
   * @param signerListSet a SignerListSet (protobuf object) whose field values will be used to construct an XrpSignerListSet
   * @return an XrpSignerListSet with its fields set via the analogous protobuf fields.
   * @see  https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L304
   */
  public static from(
    signerListSet: SignerListSet,
  ): XrpSignerListSet | undefined {
    const signerQuorum = signerListSet.getSignerQuorum()?.getValue()
    if (!signerQuorum) {
      return undefined
    }
    const signerEntries = signerListSet
      .getSignerEntriesList()
      .map((signerEntry) => XRPSignerEntry.from(signerEntry))
    return new XrpSignerListSet(signerQuorum, signerEntries)
  }

  /**
   * @param signerQuorum A target number for the signer weights. A multi-signature from this list is valid only if the sum weights
   *                     of the signatures provided is greater than or equal to this value. To delete a SignerList, use the value 0.
   * @param signerEntries (Omitted when deleting) Array of XRPSignerEntry objects, indicating the addresses and weights of signers in this list.
   *                      A SignerList must have at least 1 member and no more than 8 members. No address may appear more than once in the list,
   *                      nor may the Account submitting the transaction appear in the list.
   */
  private constructor(
    readonly signerQuorum: number,
    readonly signerEntries?: Array<XRPSignerEntry | undefined>,
  ) {}
}
