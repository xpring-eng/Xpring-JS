const isNode = (): boolean => {
  return (
    typeof process !== 'undefined' &&
    typeof process.release !== 'undefined' &&
    process.release.name === 'node'
  )
}

export default isNode
