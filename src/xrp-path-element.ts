import { Payment } from './generated/web/org/xrpl/rpc/v1/transaction_pb'
import XRPCurrency from './xrp-currency'

type PathElement = Payment.PathElement

/*
 * A path in the XRP Ledger.
 * - SeeAlso: https://xrpl.org/paths.html
 */
export default class XRPPathElement {
  public account: string | null

  public currency: XRPCurrency | null

  public issuer: string | null

  // TODO(amiecorso): is it ok to disable non-null assertion operator in these lines? (or perhaps for full file?)
  // These fields are non-optional in the protobuf, so if for example hasAccount() is true, we would expect
  // getAccount() to be non-null.
  public constructor(pathElement: PathElement) {
    this.account = pathElement.hasAccount()
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pathElement.getAccount()!.getAddress()
      : null
    this.currency = pathElement.hasCurrency()
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new XRPCurrency(pathElement.getCurrency()!)
      : null
    this.issuer = pathElement.hasIssuer()
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pathElement.getIssuer()!.getAddress()
      : null
  }
}
