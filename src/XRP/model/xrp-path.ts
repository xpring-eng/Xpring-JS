import { Payment } from '../Generated/org/xrpl/rpc/v1/transaction_pb'
import XRPPathElement from './xrp-path-element'

type Path = Payment.Path

/*
 * A path in the XRP Ledger.
 * @see: https://xrpl.org/paths.html
 */
export default class XRPPath {
  /**
   * Constructs an XRPPath from a Path.
   *
   * @param path a Path (protobuf object) whose field values will be used
   *             to construct an XRPPath
   * @returns an XRPPath with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/develop/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L237
   */
  public static from(path: Path): XRPPath {
    const pathElements = path
      .getElementsList()
      .map((pathElement) => XRPPathElement.from(pathElement))
    return new XRPPath(pathElements)
  }

  /**
   *
   * @param pathElements List of XRPPathElements that make up this XRPPath.
   */
  private constructor(
    readonly pathElements: Array<XRPPathElement | undefined>,
  ) {}
}
