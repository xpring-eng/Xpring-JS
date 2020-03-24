import { Metadata } from 'grpc'

/**
 * An extension of grpc.Metadata which provides a convenient way to
 * add an Authorization metadata header, and ensures every bearer token
 * going over the wire is prefixed with 'Bearer '
 */
class IlpCredentials extends Metadata {
  private static BEARER_SPACE = 'Bearer '

  /**
   * Static initializer, which constructs a new IlpCredentials object and adds
   * an Authorization entry.  If token is undefined, an Authorization header will
   * still be added, but the call will ultimately fail as Unauthorized
   *
   * @param token an optional access token to be added to IlpCredentials
   * @return a new instance of IlpCredentials, with an Authorization header
   */
  public static build(token?: string): IlpCredentials {
    if (token && token.startsWith(this.BEARER_SPACE)) {
      throw new Error('Access token should not start with "Bearer "')
    }
    const credentials = new IlpCredentials()
    credentials.add('Authorization', this.BEARER_SPACE.concat(token || ''))
    return credentials
  }
}

export default IlpCredentials
