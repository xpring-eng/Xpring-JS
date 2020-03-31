/**
 * Types of errors that originate from Xpring.
 */
export enum XpringErrorType {
  MismatchedNetworks,
}

/**
 * Represents errors thrown by PayID components of the Xpring SDK.
 */
export default class XpringError extends Error {
  /**
   * Default errors.
   */
  public static mismatchedNetworks = new XpringError(
    XpringErrorType.MismatchedNetworks,
    'Components are not connecting to the same network.',
  )

  /**
   * @param errorType The type of error.
   * @param message The error message.
   */
  public constructor(
    public readonly errorType: XpringErrorType,
    message: string | undefined = undefined,
  ) {
    super(message)
  }
}
