import { BigInteger } from 'big-integer'
import { IlpClientDecorator } from './ilp-client-decorator'
import DefaultIlpClient from './default-ilp-client'

class IlpClient {
  private readonly decoratedClient: IlpClientDecorator

  public constructor(grpcURL: string, forceWeb: false) {
    this.decoratedClient = DefaultIlpClient.defaultIlpClientWithEndpoint(
      grpcURL,
      forceWeb,
    )
  }

  public async getBalance(address: string): Promise<BigInteger> {
    return this.decoratedClient.getBalance(address)
  }

  public async send(
    amount: BigInteger | number | string,
    paymentPointer: string,
    sender: string,
  ): Promise<BigInteger> {
    return this.decoratedClient.send(amount, paymentPointer, sender)
  }
}

export default IlpClient
