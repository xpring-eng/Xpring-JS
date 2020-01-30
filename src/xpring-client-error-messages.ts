/**
 * Error messages from XpringClient.
 */
export default class XpringClientErrorMessages {
  public static readonly malformedResponse = 'Malformed Response.'

  public static readonly unimplemented = 'Unimplemented.'

  public static readonly signingFailure = 'Unable to sign the transaction'

  public static readonly xAddressRequired =
    'Please use the X-Address format. See: https://xrpaddress.info/.'
}
