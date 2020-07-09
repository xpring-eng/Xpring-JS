import { Error as grpcWebError, StatusCode as grpcStatusCode } from 'grpc-web'

/**
 * Types of errors that originate from ILP.
 */
export enum IlpErrorType {
  AccountNotFound,
  Internal,
  InvalidAccessToken,
  InvalidArgument,
  Unauthenticated,
  Unknown,
}

/**
 * Represents errors thrown by ILP components of the Xpring SDK.
 */
export default class IlpError extends Error {
  /**
   * Default errors.
   */
  public static accountNotFound = new IlpError(
    IlpErrorType.AccountNotFound,
    'Account not found.',
  )

  public static internal = new IlpError(
    IlpErrorType.Internal,
    'Internal error occurred on ILP network.',
  )

  public static invalidAccessToken = new IlpError(
    IlpErrorType.InvalidAccessToken,
    'Access token should not start with "Bearer "',
  )

  public static invalidArgument = new IlpError(
    IlpErrorType.InvalidArgument,
    'Invalid argument in request body.',
  )

  public static unauthenticated = new IlpError(
    IlpErrorType.Unauthenticated,
    'Authentication failed.',
  )

  public static unknown: IlpError = new IlpError(
    IlpErrorType.Unknown,
    'Unknown error occurred.',
  )

  /**
   * Public constructor.
   *
   * @param errorType The type of error.
   * @param message The error message.
   */
  public constructor(
    public readonly errorType: IlpErrorType,
    message: string | undefined = undefined,
  ) {
    super(message)
  }

  /**
   * Handle an Error thrown from an Ilp network client call by translating it to
   * a IlpError.
   *
   * gRPC services follow return an error with a status code, so we need to map gRPC error status
   * to native IlpErrors.  GrpcNetworkClient and GrpcNetworkClientWeb also sometimes throw
   * a IlpError, so we need to handle that case in here as well.
   *
   * @param error Any error returned by a network call.
   * @return A {@link IlpError} that has been translated from a gRPC error, or which should be rethrown
   */
  public static from(error: grpcWebError | IlpError): IlpError {
    console.log(error.message)

    if ('code' in error) {
      switch (error.code) {
        case grpcStatusCode.NOT_FOUND:
          return IlpError.accountNotFound
        case grpcStatusCode.UNAUTHENTICATED:
          return IlpError.unauthenticated
        case grpcStatusCode.INVALID_ARGUMENT:
          return IlpError.invalidArgument
        case grpcStatusCode.INTERNAL:
          return IlpError.internal
        default:
          return IlpError.unknown
      }
    }

    return error
  }
}
