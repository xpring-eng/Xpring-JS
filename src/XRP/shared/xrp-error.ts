/**
 * Types of errors that originate from interacting with XRPL.
 */
export enum XrpErrorType {
  InvalidInput,
  PaymentConversionFailure,
  MalformedProtobuf,
  MalformedResponse,
  AccountNotFound,
  SigningError,
  Unknown,
  XAddressRequired,
  NoViablePaths,
}

/**
 * Represents errors thrown by XRP components of the Xpring SDK.
 */
export default class XrpError extends Error {
  /**
   * An X-Address is required to use the requested functionality.
   */
  static xAddressRequired = new XrpError(
    XrpErrorType.XAddressRequired,
    'Please use the X-Address format. See: https://xrpaddress.info/.',
  )

  /**
   * A payment transaction can't be converted to an XrpTransaction.
   */
  static paymentConversionFailure = new XrpError(
    XrpErrorType.PaymentConversionFailure,
    'Could not convert payment transaction: (transaction). Please file a bug at https://github.com/xpring-eng/Xpring-JS/issues.',
  )

  /**
   * Encountered a protocol buffer formatted in contradiction to the logic of the XRPL.
   * @see xrpl.org for XRPL documentation.
   */
  static malformedProtobuf = new XrpError(
    XrpErrorType.MalformedProtobuf,
    'Encountered a protocol buffer in unexpected format.  See xrpl.org for XRPL documentation.',
  )

  /**
   * The response was in an unexpected format.
   */
  static malformedResponse = new XrpError(
    XrpErrorType.MalformedResponse,
    'The response from the remote service was malformed or in an unexpected format.',
  )

  /**
   * The account could not be found on the XRPL.
   */
  static accountNotFound = new XrpError(
    XrpErrorType.AccountNotFound,
    'The requested account could not be found on the XRPL.',
  )

  /**
   * There was a problem signing the transaction.
   */
  static signingError = new XrpError(
    XrpErrorType.SigningError,
    'There was an error signing the transaction.',
  )

  /**
   * @param errorType The type of error.
   * @param message The error message.
   */
  constructor(
    public readonly errorType: XrpErrorType,
    message: string | undefined = undefined,
  ) {
    super(message)
  }
}
