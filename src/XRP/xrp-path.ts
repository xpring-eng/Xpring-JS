import { Payment } from '../generated/web/org/xrpl/rpc/v1/transaction_pb'
import XRPPathElement from './xrp-path-element'

type Path = Payment.Path

/*
 * A path in the XRP Ledger.
 * @see: https://xrpl.org/paths.html
 */
export default class XRPPath {
  public static from(path: Path): XRPPath | undefined {
    const pathElements = path
      .getElementsList()
      .map((pathElement) => XRPPathElement.from(pathElement))
    return new XRPPath(pathElements)
  }

  private constructor(readonly pathElements: (XRPPathElement | undefined)[]) {}
}
