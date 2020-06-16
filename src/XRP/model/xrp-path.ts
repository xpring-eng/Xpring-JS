import { Payment } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import XrpPathElement, { XRPPathElement } from './xrp-path-element'

type Path = Payment.Path

/**
 * A path in the XRP Ledger.
 * @see: https://xrpl.org/paths.html
 *
 * @deprecated Use XrpPath.
 */
export class XRPPath {
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

/*
 * A path in the XRP Ledger.
 * @see: https://xrpl.org/paths.html
 */
export default class XrpPath {
  /**
   * Constructs an XrpPath from a Path.
   *
   * @param path a Path (protobuf object) whose field values will be used
   *             to construct an XrpPath
   * @returns an XrpPath with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/develop/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L237
   */
  public static from(path: Path): XrpPath {
    const pathElements = path
      .getElementsList()
      .map((pathElement) => XrpPathElement.from(pathElement))
    return new XrpPath(pathElements)
  }

  /**
   *
   * @param pathElements List of XrpPathElements that make up this XRPPath.
   */
  private constructor(
    readonly pathElements: Array<XrpPathElement | undefined>,
  ) {}
}
