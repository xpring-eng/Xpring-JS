import { Metadata } from 'grpc-web'

/**
 * An extension of grpc-web.Metadata which provides a convenient way to
 * add an Authorization metadata header, and ensures every bearer token
 * going over the wire is prefixed with 'Bearer '
 */
class IlpWebCredentials implements Metadata {
  [s: string]: string

  /**
   * Prepends 'Bearer ' to an auth token, if it is not already prefixed with 'Bearer '
   *
   * @param token An authentication token, with or without a 'Bearer ' prefix
   * @return token with a bearer prefix, or the original token if it already started with 'Bearer '
   */
  private static applyBearer(token: string): string {
    return token.startsWith('Bearer ') ? token : 'Bearer '.concat(token)
  }

  /**
   * Static initializer, which constructs a new IlpCredentials object and adds
   * an Authorization entry.  If token is undefined, this builder will return
   * undefined, so no metadata will be passed to a network call. This allows applications
   * in the browser to rely on HTTP cookies to provide authentication.
   *
   * @param token an optional bearer token to be added to IlpCredentials
   * @return a new instance of IlpCredentials, with an Authorization header if token is defined,
   *          otherwise returns undefined
   */
  public static build(token?: string): IlpWebCredentials | undefined {
    return token ? { Authorization: this.applyBearer(token) } : undefined
  }
}

export default IlpWebCredentials
