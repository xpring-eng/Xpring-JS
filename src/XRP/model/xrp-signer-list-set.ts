import { XrpError, XrpErrorType } from '..'
import { XrplNetwork } from 'xpring-common-js'
import { SignerListSet } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import XrpSignerEntry from './xrp-signer-entry'
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
    xrplNetwork: XrplNetwork,
  ): XrpSignerListSet {
    const signerQuorum = signerListSet.getSignerQuorum()?.getValue()
    if (signerQuorum == undefined) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'SignerListSet protobuf does not contain `SignerQuorum` field.',
      )
    }
    const signerEntries = signerListSet
      .getSignerEntriesList()
      .map((signerEntry) => XrpSignerEntry.from(signerEntry, xrplNetwork))
    if (signerQuorum != 0) {
      if (signerEntries.length == 0) {
        throw new XrpError(
          XrpErrorType.MalformedProtobuf,
          'SignerListSet protobuf does not contain `SignerEntries` field with nonzero `SignerQuorum` field.',
        )
      }
      if (signerEntries.length > 8) {
        throw new XrpError(
          XrpErrorType.MalformedProtobuf,
          'SignerListSet protobuf has greater than 8 members in the `SignerEntries` field.',
        )
      }
      const accounts: string[] = []
      signerEntries.forEach((signerEntry) => {
        const signerAccount = signerEntry.accountXAddress
        if (accounts.includes(signerAccount)) {
          throw new XrpError(
            XrpErrorType.MalformedProtobuf,
            'SignerListSet protobuf contains repeat account addresses in the `SignerEntries` field.',
          )
        }
        accounts.push(signerAccount)
      })
    }
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
    readonly signerEntries?: Array<XrpSignerEntry>,
  ) {}
}
