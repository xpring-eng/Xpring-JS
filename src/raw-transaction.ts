import XpringClientErrorMessages from './xpring-client-error-messages'
import { GetTxResponse as GetTxResponseWeb } from './generated/web/rpc/v1/tx_pb'
import { GetTxResponse as GetTxResponseNode } from './generated/node/rpc/v1/tx_pb'

/** Abstraction around raw Transaction Status for compatibility. */
export interface RawTransactionStatus {
  getValidated(): boolean
  getTransactionStatusCode(): string
  getLastLedgerSequence(): number
}

/**
 * A wrapper class which conforms `GetTxResponse` to the `RawTransaction` interface.
 */
export default class RawTransaction {
  public constructor(
    private readonly getTxResponse: GetTxResponseWeb | GetTxResponseNode,
  ) {}

  public getValidated(): boolean {
    return this.getTxResponse.getValidated()
  }

  public getTransactionStatusCode(): string {
    const meta = this.getTxResponse.getMeta()
    if (!meta) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }

    const transactionResult = meta.getTransactionResult()
    if (!transactionResult) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }

    return transactionResult.getResult()
  }

  public getLastLedgerSequence(): number {
    const transaction = this.getTxResponse.getTransaction()
    if (!transaction) {
      throw new Error(XpringClientErrorMessages.malformedResponse)
    }

    return transaction.getLastLedgerSequence()
  }
}
