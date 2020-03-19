/**
 * A result monad for a type T. Either an instance of T, or an error.
 */
type Result<T> = T | Error

export default Result
