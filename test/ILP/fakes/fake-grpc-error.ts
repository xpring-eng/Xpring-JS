import grpcStatus from '../../../src/Common/grpc-status'

/**
 * Convenience class for creating more specific Error objects to mock gRPC error responses.
 */
export default class FakeGRPCError extends Error {
  /**
   * Construct a new FakeServiceError.
   *
   * @param message The text details of the error.
   * @param code The grpcStatus code.
   */
  constructor(public readonly code: grpcStatus) {
    super('')
  }
}
