import { Utils } from 'xpring-common-js/build/src'

const isNode = (): boolean => {
  return process?.release?.name === 'node'
}

export const stringToHex = (value: string): string => {
  let result = ''
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < value.length; i++) {
    result += value.charCodeAt(i).toString(16)
  }
  return result
}

export const stringToUint8Array = (
  value?: string,
  isHex?: boolean,
): Uint8Array | undefined => {
  return value && !isHex
    ? Utils.toBytes(stringToHex(value))
    : (value && Utils.toBytes(value)) || undefined
}

export default isNode
