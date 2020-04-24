const isNode = (): boolean => {
  return process?.release?.name === 'node'
}

export default isNode
