/**
 * Types of errors that originate from ILP.
 */
export enum XpringIlpErrorType {
  InvalidAccessToken,
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
