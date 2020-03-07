import { Payment } from './generated/web/org/xrpl/rpc/v1/transaction_pb'
import XRPPathElement from './xrp-path-element'

type Path = Payment.Path
type PathElement = Payment.PathElement

/*
 * A path in the XRP Ledger.
 * - SeeAlso: https://xrpl.org/paths.html
 */
export default class XRPPath {
  public pathElements: XRPPathElement[]

  public constructor(path: Path) {
    const protoPathElements: PathElement[] = path.getElementsList()
    this.pathElements = protoPathElements.map(
      (pathElement) => new XRPPathElement(pathElement),
    )
  }
}
