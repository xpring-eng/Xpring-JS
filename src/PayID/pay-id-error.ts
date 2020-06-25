/* eslint-disable max-classes-per-file */

/**
 * Types of errors that originate from PayID.
 */
export enum PayIdErrorType {
  InvalidPayId,
  MappingNotFound,
  UnexpectedResponse,
  Unimplemented,
  Unknown,
}

/**
 * Represents errors thrown by PayID components of the Xpring SDK.
 */
export default class PayIdError extends Error {
  /**
   * Default errors.
   */
  public static unimplemented = new PayIdError(
    PayIdErrorType.Unimplemented,
    'Unimplemented',
  )

  public static invalidPayId = new PayIdError(
    PayIdErrorType.InvalidPayId,
    'Invalid payment pointer',
  )

  /**
   * @param errorType The type of error.
   * @param message The error message.
   */
  public constructor(
    public readonly errorType: PayIdErrorType,
    message: string | undefined = undefined,
  ) {
    super(message)
  }
}
