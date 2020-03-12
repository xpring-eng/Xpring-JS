import { Metadata } from 'grpc'

/**
 * An extension of grpc.Metadata which provides a convenient way to
 * add an Authorization metadata header, and ensures every bearer token
 * going over the wire is prefixed with 'Bearer '
 */
class IlpCredentials extends Metadata {
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
   * an Authorization entry.  If token is undefined, an Authorization header will
   * still be added, but the call will ultimately fail as Unauthorized
   *
   * @param token an optional bearer token to be added to IlpCredentials
   * @return a new instance of IlpCredentials, with an Authorization header
   */
  public static build(token?: string): IlpCredentials {
    const credentials = new IlpCredentials()
    credentials.add('Authorization', this.applyBearer(token || ''))
    return credentials
  }
}

export default IlpCredentials
