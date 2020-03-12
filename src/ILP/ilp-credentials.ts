import { Metadata } from "grpc";

class IlpCredentials extends Metadata {

  private static applyBearer(token: string): string {
    return token.startsWith('Bearer ') ? token : 'Bearer '.concat(token)
  }

  public static build(token?: string): IlpCredentials {
    let credentials = new IlpCredentials()
    credentials.add('Authorization', this.applyBearer(token || ''))
    return credentials
  }
}

export default IlpCredentials
