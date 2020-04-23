/**
 * Convenience class for creating more specific Error objects to mimick gRPC error responses.
 */
// TODO(amiecorso): merge xrp and ilp fake-grpc-errors into common location
export default class FakeGRPCError extends Error {
  /**
   * Construct a new FakeServiceError.
   *
   * @param message The text details of the error.
   * @param code The gRPC status code.
   */
  constructor(public readonly message: string, public readonly code: number) {
    super(message)
  }
}
