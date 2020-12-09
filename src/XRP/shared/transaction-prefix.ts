/** Represents prefixes of transaction statuses. */
enum TransactionPrefix {
  ClaimedCostOnly = 'tec',
  Failure = 'tef',
  LocalError = 'tel',
  MalformedTransaction = 'tem',
  Retry = 'ter',
  Success = 'tes',
}

export default TransactionPrefix
