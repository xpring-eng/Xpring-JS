import { Metadata } from 'grpc-web'
import { AuthUtils } from './auth-utils'

/**
 * An extension of grpc-web.Metadata which provides a convenient way to
 * add an Authorization metadata header, and ensures every bearer token
 * going over the wire is prefixed with 'Bearer '
 */
class IlpCredentials implements Metadata {
  [s: string]: string

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
  public static build(token?: string): IlpCredentials | undefined {
    return token ? { Authorization: AuthUtils.applyBearer(token) } : undefined
  }
}

export default IlpCredentials
