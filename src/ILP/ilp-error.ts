/**
 * Types of errors that originate from ILP.
 */
export enum IlpErrorType {
  InvalidAccessToken,
  AccountNotFound,
  Unauthenticated,
  InvalidArgument,
  Internal,
}

/**
 * Represents errors thrown by ILP components of the Xpring SDK.
 */
export default class IlpError extends Error {
  /**
   * Default errors.
   */
  public static invalidAccessToken = new IlpError(
    IlpErrorType.InvalidAccessToken,
    'Access token should not start with "Bearer "',
  )

  public static accountNotFound = new IlpError(
    IlpErrorType.AccountNotFound,
    'Account not found.',
  )

  public static unauthenticated = new IlpError(
    IlpErrorType.Unauthenticated,
    'Authentication failed.',
  )

  public static invalidArgument = new IlpError(
    IlpErrorType.InvalidArgument,
    'Invalid argument in request body.',
  )

  public static internal = new IlpError(
    IlpErrorType.Internal,
    'Internal error occurred on ILP network.',
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
}
