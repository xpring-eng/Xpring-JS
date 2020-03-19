/**
 * Types of errors that originate from PayID.
 */
export enum PayIDErrorType {
  InvalidPaymentPointer,
  MappingNotFound,
  UnexpectedResponse,
  Unimplemented,
  Unknown,
}

/**
 * Represents errors thrown by PayID components of the Xpring SDK.
 */
export default class PayIDError extends Error {
  /**
   * Default errors.
   */
  public static unimplemented = new PayIDError(
    PayIDErrorType.Unimplemented,
    'Unimplemented',
  )

  public static invalidPaymentPointer = new PayIDError(
    PayIDErrorType.InvalidPaymentPointer,
    'Invalid payment pointer',
  )

  /**
   * @param errorType The type of error.
   * @param message The error message.
   */
  public constructor(
    public readonly errorType: PayIDErrorType,
    message: string | undefined = undefined,
  ) {
    super(message)
  }
}
