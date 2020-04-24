/**
 * Convenience class for creating more specific Error objects to mock gRPC error responses.
 */
export default class FakeGRPCError extends Error {
  /**
   * Construct a new FakeServiceError.
   *
   * @param message The text details of the error.
   * @param code The gRPC status code.
   */
  constructor(public readonly code: number) {
    super('')
  }
}
