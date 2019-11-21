import { Wallet } from "xpring-common-js";
import XpringClient from "../src/xpring-client";
import { assert } from "chai";

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* global BigInt */

// A timeout for these tests.
const timeoutMs = 60 * 1000; // 1 minute

// An address on TestNet that has a balance.
const recipientAddress = "X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4";

// A wallet with some balance on TestNet.
const wallet = Wallet.generateWalletFromSeed("snYP7oArxKepd3GPDcrjMsJYiJeJB")!;

// The XpringClient that makes requests
const grpcURL = "grpc.xpring.tech:80";
const xrpClient = new XpringClient(grpcURL);

// Some amount of XRP to send.
const amount = BigInt("1");

describe("Xpring JS Integration Tests", function(): void {
  it("Get Account Balance", async function() {
    this.timeout(timeoutMs);

    const balance = await xrpClient.getBalance(recipientAddress);
    assert.exists(balance);
  });

  it("Send XRP", async function() {
    this.timeout(timeoutMs);

    const result = await xrpClient.send(amount, recipientAddress, wallet);
    assert.exists(result);
  });
});
