import grpc from 'grpc'
/**
 * Convenience class for creating more specific Error objects to mimick grpc error responses.
 */
export default class FakeGRPCError extends Error {
  /**
   * Construct a new FakeServiceError.
   *
   * @param message The text details of the error.
   * @param code The grpc.status code.
   */
  constructor(
    public readonly message: string,
    public readonly code: grpc.status,
  ) {
    super(message)
  }
}
