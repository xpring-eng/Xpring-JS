import DefaultIlpClient from '../../../src/ILP/default-ilp-client'
import {
  FakeIlpNetworkClient,
  FakeIlpNetworkClientResponses,
} from './fake-ilp-network-client'

/**
 * Contains all of the fake DefaultIlpClients needed by DefaultIlpClient Tests.
 */
export default class FakeDefaultIlpClients {
  /**
   * A DefaultIlpClient with a FakeIlpNetworkClient that always succeeds.
   */
  public static fakeSuceedingNetworkClient = (): DefaultIlpClient => {
    return new DefaultIlpClient(new FakeIlpNetworkClient())
  }

  /**
   * A DefaultIlpClient with a FakeIlpNetworkClient that always fails with default errors
   */
  public static fakeErroringNetworkClient = (): DefaultIlpClient => {
    return new DefaultIlpClient(
      new FakeIlpNetworkClient(
        FakeIlpNetworkClientResponses.defaultErrorResponses,
      ),
    )
  }

  /**
   * A DefaultIlpClient with a FakeIlpNetworkClient that always fails with grpc.status.NOT_FOUND
   */
  public static fakeNotFoundErrorClient = (): DefaultIlpClient => {
    return new DefaultIlpClient(
      new FakeIlpNetworkClient(
        FakeIlpNetworkClientResponses.notFoundErrorResponses,
      ),
    )
  }

  /**
   * A DefaultIlpClient with a FakeIlpNetworkClient that always fails with grpc.status.UNAUTHENTICATED
   */
  public static fakeUnauthenticatedErrorClient = (): DefaultIlpClient => {
    return new DefaultIlpClient(
      new FakeIlpNetworkClient(
        FakeIlpNetworkClientResponses.unauthenticatedErrorResponses,
      ),
    )
  }

  /**
   * A DefaultIlpClient with a FakeIlpNetworkClient that always fails with grpc.status.INVALID_ARGUMENT
   */
  public static fakeInvalidArgumentErrorClient = (): DefaultIlpClient => {
    return new DefaultIlpClient(
      new FakeIlpNetworkClient(
        FakeIlpNetworkClientResponses.invalidArgumentErrorResponses,
      ),
    )
  }

  /**
   * A DefaultIlpClient with a FakeIlpNetworkClient that always fails with grpc.status.INTERNAL
   */
  public static fakeInternalErrorClient = (): DefaultIlpClient => {
    return new DefaultIlpClient(
      new FakeIlpNetworkClient(
        FakeIlpNetworkClientResponses.internalErrorResponses,
      ),
    )
  }

  /**
   * A DefaultIlpClient with a FakeIlpNetworkClient that always fails with XpringIlpError.invalidAccessToken
   */
  public static fakeInvalidAccessTokenErrorClient = (): DefaultIlpClient => {
    return new DefaultIlpClient(
      new FakeIlpNetworkClient(
        FakeIlpNetworkClientResponses.invalidAccessTokenErrorResponses,
      ),
    )
  }
}
