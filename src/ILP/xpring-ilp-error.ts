/**
 * Types of errors that originate from ILP.
 */
export enum XpringIlpErrorType {
  InvalidAccessToken,
  AccountAlreadyExists,
  AccountNotFound,
  Unauthenticated,
  InvalidArgument,
  Internal,
}

/**
 * Represents errors thrown by ILP components of the Xpring SDK.
 */
export default class XpringIlpError extends Error {
  /**
   * Default errors.
   */
  public static invalidAccessToken = new XpringIlpError(
    XpringIlpErrorType.InvalidAccessToken,
    'Access token should not start with "Bearer "',
  )

  public static accountAlreadyExists = new XpringIlpError(
    XpringIlpErrorType.AccountAlreadyExists,
    'Account already exists.',
  )

  public static accountNotFound = new XpringIlpError(
    XpringIlpErrorType.AccountNotFound,
    'Account not found.',
  )

  public static unauthenticated = new XpringIlpError(
    XpringIlpErrorType.Unauthenticated,
    'Authentication failed.',
  )

  public static invalidArgument = new XpringIlpError(
    XpringIlpErrorType.InvalidArgument,
    'Invalid argument in request body.',
  )

  public static internal = new XpringIlpError(
    XpringIlpErrorType.Internal,
    'Internal error occurred on ILP network.',
  )

  /**
   * Public constructor.
   *
   * @param errorType The type of error.
   * @param message The error message.
   */
  public constructor(
    public readonly errorType: XpringIlpErrorType,
    message: string | undefined = undefined,
  ) {
    super(message)
  }
}
