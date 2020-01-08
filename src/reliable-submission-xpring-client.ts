import { XpringClientDecorator } from "./xpring-client-decorator";
import { Wallet } from "xpring-common-js";
import RawTransactionStatus from "./raw-transaction-status";

/* global BigInt */
/* eslint-disable @typescript-eslint/no-magic-numbers */

async function sleep(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * A XpringClient which blocks on `send` calls until the transaction has reached a deterministic state.
 */
class ReliableSubmissionXpringClient implements XpringClientDecorator {
  public constructor(private readonly decoratedClient: XpringClientDecorator) {}

  public async getBalance(address: string): Promise<BigInt> {
    return await this.decoratedClient.getBalance(address);
  }

  public async getTransactionStatus(
    transactionHash: string
  ): Promise<import("./transaction-status").default> {
    return await this.decoratedClient.getTransactionStatus(transactionHash);
  }

  public async send(
    amount: string | number | BigInt,
    destination: string,
    sender: Wallet
  ): Promise<string> {
    const ledgerCloseTimeMs = 4 * 1000;

    // Submit a transaction hash and wait for a ledger to close.
    const transactionHash = await this.decoratedClient.send(
      amount,
      destination,
      sender
    );
    await sleep(ledgerCloseTimeMs);

    // Get transaction status.
    var rawTransactionStatus = await this.getRawTransactionStatus(
      transactionHash
    );
    const lastLedgerSequence = rawTransactionStatus.getLastLedgerSequence();
    if (lastLedgerSequence == 0) {
      return Promise.reject(
        "The transaction did not have a lastLedgerSequence field so transaction status cannot be reliably determined."
      );
    }

    // Retrieve the latest ledger index.
    var latestLedgerSequence = await this.getLastValidatedLedgerSequence();

    // Poll until the transaction is validated, or until the lastLedgerSequence has been passed.
    while (
      latestLedgerSequence <= lastLedgerSequence &&
      !rawTransactionStatus.getValidated()
    ) {
      await sleep(ledgerCloseTimeMs);

      // Update latestLedgerSequence and rawTransactionStatus
      latestLedgerSequence = await this.getLastValidatedLedgerSequence();
      rawTransactionStatus = await this.getRawTransactionStatus(
        transactionHash
      );
    }

    return transactionHash;
  }

  public async getLastValidatedLedgerSequence(): Promise<number> {
    return await this.decoratedClient.getLastValidatedLedgerSequence();
  }

  public async getRawTransactionStatus(
    transactionHash: string
  ): Promise<RawTransactionStatus> {
    return await this.decoratedClient.getRawTransactionStatus(transactionHash);
  }
}

export default ReliableSubmissionXpringClient;
