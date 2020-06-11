import { SignerEntry } from '../Generated/web/org/xrpl/rpc/v1/common_pb'

/*
 * Represents a SignerEntry object on the XRP Ledger.
 *
 * @see: https://xrpl.org/signerlist.html#signerentry-object
 */
export default class XrpSignerEntry {
  /**
   * Constructs an XrpSignerEntry from a SignerEntry protocol buffer.
   *
   * @param signerEntry a SignerEntry (protobuf object) whose field values will be used to construct an XrpSignerEntry
   * @return an XrpSignerEntry with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/f43aeda49c5362dc83c66507cae2ec71cfa7bfdf/src/ripple/proto/org/xrpl/rpc/v1/common.proto#L471
   */
  public static from(signerEntry: SignerEntry): XrpSignerEntry | undefined {
    const account = signerEntry.getAccount()?.getValue()?.getAddress()
    const signerWeight = signerEntry.getSignerWeight()?.getValue()
    if (!account || !signerWeight) {
      return undefined
    }
    return new XrpSignerEntry(account, signerWeight)
  }

  /**
   * @param account An XRP Ledger address whose signature contributes to the multi-signature.
   *                It does not need to be a funded address in the ledger.
   * @param signerWeight The weight of a signature from this signer. A multi-signature is only valid if the sum
   *                     weight of the signatures provided meets or exceeds the SignerList's SignerQuorum value.
   */
  private constructor(
    readonly account?: string,
    readonly signerWeight?: number,
  ) {}
}
