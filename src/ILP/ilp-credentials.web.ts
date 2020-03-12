import { Metadata } from 'grpc-web'

class IlpCredentials implements Metadata {
  [s: string]: string

  private static applyBearer(token: string): string {
    return token.startsWith('Bearer ') ? token : 'Bearer '.concat(token)
  }

  public static build(token?: string): IlpCredentials | undefined {
    return token ? { Authorization: this.applyBearer(token) } : undefined
  }
}

export default IlpCredentials
