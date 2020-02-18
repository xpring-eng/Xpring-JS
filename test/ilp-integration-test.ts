import IlpClient from '../src/ilp-client'

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

// A ILP Client that makes requests.
const ILPAddress = 'hermes-grpc.ilpv4.dev'
const ILPClient = new IlpClient(ILPAddress)

describe('ILP Integration Tests', function(): void {
  it('Get Account Balance - Legacy Node Shim', async function(): Promise<void> {
    this.timeout(timeoutMs)
    try {
      console.log(await ILPClient.getBalance('__ping__'))
    } catch (e) {
      console.log(e)
    }
  })
})
