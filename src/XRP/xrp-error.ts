/**
 * Types of errors that originate from interacting with XRPL.
 */
export enum XRPErrorType {
  PaymentConversionFailure,
  MalformedResponse,
  SigningError,
  Unknown,
  XAddressRequired,
}

/**
 * Represents errors thrown by XRP components of the Xpring SDK.
 */
export default class XRPError extends Error {
  /**
   * An X-Address is required to use the requested functionality.
   */
  static xAddressRequired = new XRPError(
    XRPErrorType.XAddressRequired,
    'Please use the X-Address format. See: https://xrpaddress.info/.',
  )

  /**
   * A payment transaction can't be converted to an XRPTransaction.
   */
  static paymentConversionFailure = new XRPError(
    XRPErrorType.PaymentConversionFailure,
    'Could not convert payment transaction: (transaction). Please file a bug at https://github.com/xpring-eng/Xpring-JS/issues',
  )

  /**
   * The response was in an unexpected format.
   */
  static malformedResponse = new XRPError(
    XRPErrorType.MalformedResponse,
    'The response from the remote service was malformed or in an unexpected format',
  )

  /**
   * @param errorType The type of error.
   * @param message The error message.
   */
  constructor(
    public readonly errorType: XRPErrorType,
    message: string | undefined = undefined,
  ) {
    super(message)
  }
}
