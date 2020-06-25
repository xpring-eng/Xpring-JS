import XrpPayIdClientInterface from '../../../src/PayID/xrp-pay-id-client-interface'
import Result from '../../Common/Helpers/result'
import XrplNetwork from '../../../src/Common/xrpl-network'

/**
 * A fake XrpPayIdClient which can return faked values.
 */
export default class FakeXrpPayIdClient implements XrpPayIdClientInterface {
  /**
   * @param xrpAddressResult The object that will be returned or thrown from a call to `xrpAddressForPayID`.
   */
  constructor(
    private readonly xrpAddressResult: Result<string>,
    public readonly xrplNetwork: XrplNetwork = XrplNetwork.Test,
  ) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async xrpAddressForPayId(_payID: string): Promise<string> {
    if (this.xrpAddressResult instanceof Error) {
      throw this.xrpAddressResult
    }

    return this.xrpAddressResult
  }
}
