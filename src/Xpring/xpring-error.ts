/**
 * Types of errors that originate from Xpring.
 */
export enum XpringErrorType {
  MismatchedNetworks,
}

/**
 * Represents errors thrown by Xpring components of the Xpring SDK.
 */
export default class XpringError extends Error {
  /**
   * Input entities given to a Xpring component were attached to different networks.
   *
   * For instance, this error may be thrown if a XpringClient was constructed with
   * a PayIDClient attached to Testnet and an XRPClient attached to Mainnet.
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
