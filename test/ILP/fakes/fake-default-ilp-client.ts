import DefaultIlpClient from '../../../src/ILP/default-ilp-client'
import { FakeIlpNetworkClient } from './fake-ilp-network-client'

/**
 * Contains all of the fake DefaultIlpClients needed by DefaultIlpClient Tests.
 */
export default class FakeDefaultIlpClient {
  /**
   * Creates a {@link DefaultIlpClient} with network clients that will always respond with the specified error.
   *
   * @param responseError The error that will be returned by the resulting {@link DefaultIlpClient}'s
   *        {@link IlpNetworkClient}
   * @return a {@link DefaultIlpClient} with network clients that always return responseError
   */
  public static withErrors(responseError: Error): DefaultIlpClient {
    return new DefaultIlpClient(FakeIlpNetworkClient.withErrors(responseError))
  }

  /**
   * A DefaultIlpClient with a FakeIlpNetworkClient that always succeeds.
   */
  public static fakeSuceedingNetworkClient = (): DefaultIlpClient => {
    return new DefaultIlpClient(new FakeIlpNetworkClient())
  }
}
