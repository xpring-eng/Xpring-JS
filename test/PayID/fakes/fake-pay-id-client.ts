import PayIDClientInterface from '../../../src/PayID/pay-id-client-interface'

/**
 * A response for a request to retrieve type T. Either an instance of T, or an error.
 */
// TODO(keefertaylor): Deduplicate this type across `FakeNetworkClient` and this file.
// TODO(keefertaylor): Rename this to `Result` which is more inline with what it actually is.
type Response<T> = T | Error

/**
 * A fake Pay ID Client which can return faked values.
 */
export default class FakePayIDClient implements PayIDClientInterface {
  /**
   * @param xrpAddressResult The object that will be returned or thrown from a call to `xrpAddressForPayID`.
   */
  constructor(
    private readonly xrpAddressResult: Response<string | undefined>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async xrpAddressForPayID(_payID: string): Promise<string | undefined> {
    if (this.xrpAddressResult instanceof Error) {
      throw this.xrpAddressResult
    }

    return this.xrpAddressResult
  }
}
