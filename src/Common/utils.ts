import { Utils } from 'xpring-common-js'

const isNode = (): boolean => {
  return process?.release?.name === 'node'
}

/**
 * Converts a string such that each of its characters are represented as hex.
 *
 * @param value - the string to convert to hex.
 * @returns the hex encoded version of the string.
 */
export const stringToHex = (value: string): string => {
  return Buffer.from(value).toString('hex')
}

/**
 * Converts a string that is optionally in hex format into a Uint8Array.
 *
 * @param value - the string to convert to a Uint8Array.
 * @param isHex - flag to indicate it's a hex string or not.
 * @returns the Uint8Array value.
 */
export const stringToUint8Array = (
  value?: string,
  isHex?: boolean,
): Uint8Array | undefined => {
  return value && !isHex
    ? Utils.toBytes(stringToHex(value))
    : (value && Utils.toBytes(value)) || undefined
}

export default isNode
