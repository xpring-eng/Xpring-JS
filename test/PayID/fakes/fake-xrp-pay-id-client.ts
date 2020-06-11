import { XRPPayIDClientInterface } from '../../../src/PayID/xrp-pay-id-client-interface'
import Result from '../../Common/Helpers/result'
import { XRPLNetwork } from '../../../src/Common/xrpl-network'

/**
 * A fake XRPPayIDClient which can return faked values.
 */
export default class FakeXRPPayIDClient implements XRPPayIDClientInterface {
  /**
   * @param xrpAddressResult The object that will be returned or thrown from a call to `xrpAddressForPayID`.
   */
  constructor(
    private readonly xrpAddressResult: Result<string>,
    public readonly xrplNetwork: XRPLNetwork = XRPLNetwork.Test,
  ) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async xrpAddressForPayID(_payID: string): Promise<string> {
    if (this.xrpAddressResult instanceof Error) {
      throw this.xrpAddressResult
    }

    return this.xrpAddressResult
  }
}
