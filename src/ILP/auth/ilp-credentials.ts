import { Metadata } from 'grpc'
import { AuthUtils } from './auth-utils'

/**
 * An extension of grpc.Metadata which provides a convenient way to
 * add an Authorization metadata header, and ensures every bearer token
 * going over the wire is prefixed with 'Bearer '
 */
class IlpCredentials extends Metadata {
  /**
   * Static initializer, which constructs a new IlpCredentials object and adds
   * an Authorization entry.  If token is undefined, an Authorization header will
   * still be added, but the call will ultimately fail as Unauthorized
   *
   * @param token an optional bearer token to be added to IlpCredentials
   * @return a new instance of IlpCredentials, with an Authorization header
   */
  public static build(token?: string): IlpCredentials {
    const credentials = new IlpCredentials()
    credentials.add('Authorization', AuthUtils.applyBearer(token || ''))
    return credentials
  }
}

export default IlpCredentials
