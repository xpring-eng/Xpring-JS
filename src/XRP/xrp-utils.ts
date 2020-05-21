/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-namespace */
import BigNumber from 'bignumber.js'
import { XRPErrorType, XRPError } from '..'

namespace XRPUtils {
  export function dropsToXrp(drops: BigNumber.Value): string {
    const dropsRegEx = RegExp(/^-?[0-9]*\.?[0-9]*$/)

    if (typeof drops === 'string') {
      if (!dropsRegEx.exec(drops)) {
        throw new XRPError(
          XRPErrorType.InvalidInput,
          `dropsToXrp: invalid value '${drops}',` +
            ` should be a number matching (^-?[0-9]*\\.?[0-9]*$).`,
        )
      } else if (drops === '.') {
        throw new XRPError(
          XRPErrorType.InvalidInput,
          `dropsToXrp: invalid value '${drops}',` +
            ` should be a BigNumber or string-encoded number.`,
        )
      }
    }

    // Converting to BigNumber and then back to string should remove any
    // decimal point followed by zeros, e.g. '1.00'.
    // Important: specify base 10 to avoid exponential notation, e.g. '1e-7'.
    // eslint-disable-next-line no-param-reassign
    drops = new BigNumber(drops).toString(10)

    // drops are only whole units
    if (drops.includes('.')) {
      throw new XRPError(
        XRPErrorType.InvalidInput,
        `dropsToXrp: value '${drops}' has too many decimal places.`,
      )
    }

    // This should never happen; the value has already been
    // validated above. This just ensures BigNumber did not do
    // something unexpected.

    if (!dropsRegEx.exec(drops)) {
      throw new XRPError(
        XRPErrorType.InvalidInput,
        `dropsToXrp: failed sanity check -` +
          ` value '${drops}',` +
          ` does not match (^-?[0-9]+$).`,
      )
    }

    return new BigNumber(drops).dividedBy(1000000.0).toString(10)
  }

  export function xrpToDrops(xrp: BigNumber.Value): string {
    const xrpRegEx = RegExp(/^-?[0-9]*\.?[0-9]*$/)

    if (typeof xrp === 'string') {
      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      if (!xrpRegEx.exec(xrp)) {
        throw new XRPError(
          XRPErrorType.InvalidInput,
          `xrpToDrops: invalid value '${xrp}',` +
            ` should be a number matching (^-?[0-9]*\\.?[0-9]*$).`,
        )
      } else if (xrp === '.') {
        throw new XRPError(
          XRPErrorType.InvalidInput,
          `xrpToDrops: invalid value '${xrp}',` +
            ` should be a BigNumber or string-encoded number.`,
        )
      }
    }

    // Important: specify base 10 to avoid exponential notation, e.g. '1e-7'.
    // eslint-disable-next-line no-param-reassign
    xrp = new BigNumber(xrp).toString(10)

    // This should never happen; the value has already been
    // validated above. This just ensures BigNumber did not do
    // something unexpected.
    if (!xrpRegEx.exec(xrp)) {
      throw new XRPError(
        XRPErrorType.InvalidInput,
        `xrpToDrops: failed sanity check -` +
          ` value '${xrp}',` +
          ` does not match (^-?[0-9.]+$).`,
      )
    }

    const components = xrp.split('.')
    if (components.length > 2) {
      throw new XRPError(
        XRPErrorType.InvalidInput,
        `xrpToDrops: failed sanity check -` +
          ` value '${xrp}' has` +
          ` too many decimal points.`,
      )
    }

    const fraction = components[1] || '0'
    if (fraction.length > 6) {
      throw new XRPError(
        XRPErrorType.InvalidInput,
        `xrpToDrops: value '${xrp}' has too many decimal places.`,
      )
    }

    return new BigNumber(xrp)
      .times(1000000.0)
      .integerValue(BigNumber.ROUND_FLOOR)
      .toString(10)
  }
}

export default XRPUtils
