import { XrpError, XrpErrorType } from '..'
import XrpUtils from '../xrp-utils'
import { SignerEntry } from '../Generated/web/org/xrpl/rpc/v1/common_pb'
import { XrplNetwork } from 'xpring-common-js'

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
  public static from(
    signerEntry: SignerEntry,
    xrplNetwork: XrplNetwork,
  ): XrpSignerEntry {
    const account = signerEntry.getAccount()?.getValue()?.getAddress()
    if (!account) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'SignerEntry protobuf does not contain `account` field.',
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
        'Cannot construct XAddress from SignerEntry protobuf `account` field.',
      )
    }

    const signerWeight = signerEntry.getSignerWeight()?.getValue()
    if (signerWeight === undefined) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'SignerEntry protobuf does not contain `signerWeight` field.',
      )
    }
    return new XrpSignerEntry(accountXAddress, signerWeight)
  }

  /**
   * @param account An XRP Ledger address whose signature contributes to the multi-signature, encoded as an
   *                X-address (see https://xrpaddress.info/). It does not need to be a funded address in the ledger.
   * @param signerWeight The weight of a signature from this signer. A multi-signature is only valid if the sum
   *                     weight of the signatures provided meets or exceeds the SignerList's SignerQuorum value.
   */
  private constructor(
    readonly accountXAddress: string,
    readonly signerWeight: number,
  ) {}
}
