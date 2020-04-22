/**
 * gRPC status codes
 * https://github.com/grpc/grpc/blob/master/doc/statuscodes.md
 */
enum grpcStatus {
  OK,
  Cancelled,
  Unknown,
  InvalidArgument,
  DeadlineExceeded,
  NotFound,
  AlreadyExists,
  PermissionDenied,
  ResourceExhausted,
  FailedPrecondition,
  Aborted,
  OutOfRange,
  Unimplemented,
  Internal,
  Unavailable,
  DataLoss,
  Unauthenticated,
}

export default grpcStatus
