const isNode = (): boolean => {
  return typeof process !== 'undefined' && process.release.name === 'node'
}

export default isNode
