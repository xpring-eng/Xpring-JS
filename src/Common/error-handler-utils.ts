import { Error as grpcWebError } from 'grpc-web'
import { ServiceError, status } from 'grpc'
import XpringIlpError from '../ILP/xpring-ilp-error'

/**
 * Utility class for translating gRPC errors to native Xpring SDK errors.
 * Though grpc-web and grpc handle errors differently (returned errors are separate classes),
 * they both follow the same error coding rules as defined here
 * https://github.com/grpc/grpc/blob/master/doc/statuscodes.md.  This means that this class can translate
 * any gRPC error code into a native error.
 */
export default class ErrorHandlerUtils {
  /**
   * Handle an Error thrown from an Ilp network client call by translating it to
   * a XpringIlpError. gRPC services follow return an error with a status code,
   * so we need to map gRPC error status to native XpringIlpErrors.
   * GrpcNetworkClient and GrpcNetworkClientWeb also sometimes throw a XpringIlpError,
   * so we need to handle that case in here as well.
   *
   * @param error Any error returned by a network call.
   */
  public static handleIlpServiceError(
    error: ServiceError | grpcWebError | XpringIlpError,
  ): Error {
    // Rethrow XpringIlpErrors
    if (error instanceof XpringIlpError) {
      return error
    }

    // Just regular TS Errors (duck typed here)
    if (!error.code) {
      return error as Error
    }

    switch (error.code) {
      case status.ALREADY_EXISTS:
        return XpringIlpError.accountAlreadyExists
      case status.NOT_FOUND:
        return XpringIlpError.accountNotFound
      case status.UNAUTHENTICATED:
        return XpringIlpError.unauthenticated
      case status.INVALID_ARGUMENT:
        return XpringIlpError.invalidArgument
      default:
        return XpringIlpError.internal
    }
  }
}
