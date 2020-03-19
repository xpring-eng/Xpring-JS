/**
 * Utility class used by IlpCredentials to perform various tasks which are common to both web and node
 * network clients.
 */
export class AuthUtils {
  /**
   * Prepends 'Bearer ' to an auth token, if it is not already prefixed with 'Bearer '
   *
   * @param token An authentication token, with or without a 'Bearer ' prefix
   * @return token with a bearer prefix, or the original token if it already started with 'Bearer '
   */
  static applyBearer(token: string): string {
    return token.startsWith('Bearer ') ? token : 'Bearer '.concat(token)
  }
}

export default AuthUtils
