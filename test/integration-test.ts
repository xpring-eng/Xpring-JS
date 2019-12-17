import { Wallet } from "xpring-common-js";
import XpringClient from "../src/xpring-client";
import { assert } from "chai";
import TransactionStatus from "../src/transaction-status";

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* global BigInt */

// A timeout for these tests.
const timeoutMs = 60 * 1000; // 1 minute

// An address on TestNet that has a balance.
const recipientAddress = "X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4";

// A wallet with some balance on TestNet.
const wallet = Wallet.generateWalletFromSeed("snYP7oArxKepd3GPDcrjMsJYiJeJB")!;

// A hash of a successfully validated transaction.
const transactionHash =
  "2CBBD2523478848DA256F8EBFCBD490DD6048A4A5094BF8E3034F57EA6AA0522";

// The XpringClient that makes requests
const grpcURL = "127.0.0.1:50051"; // "grpc.xpring.tech:80";
const xpringClient = new XpringClient(grpcURL);

// Some amount of XRP to send.
const amount = BigInt("1");

describe("Xpring JS Integration Tests", function(): void {
  it("Get Account Balance", async function() {
    this.timeout(timeoutMs);

    const balance = await xpringClient.getBalance(recipientAddress);
    assert.exists(balance);
  });

  // it("Get Transaction Status", async function() {
  //   this.timeout(timeoutMs);

  //   const transactionStatus = await xpringClient.getTransactionStatus(
  //     transactionHash
  //   );
  //   assert.deepEqual(transactionStatus, TransactionStatus.Succeeded);
  // });

  // it("Send XRP", async function() {
  //   this.timeout(timeoutMs);

  //   const result = await xpringClient.send(amount, recipientAddress, wallet);
  //   assert.exists(result);
  // });
});
