import { assert } from "chai";

/* global BigInt */

import {
  Utils,
  Wallet,
  WalletGenerationResult,
  TransactionStatus as TransactionStatusResponse
} from "xpring-common-js";

import chai from "chai";
import chaiString from "chai-string";
import DefaultXpringClient, {
  XpringClientErrorMessages
} from "../src/default-xpring-client";
import {
  FakeNetworkClient,
  FakeNetworkClientResponses
} from "./fakes/fake-network-client";
import "mocha";
import TransactionStatus from "../src/transaction-status";

const fakeSucceedingNetworkClient = new FakeNetworkClient();
const fakeErroringNetworkClient = new FakeNetworkClient(
  FakeNetworkClientResponses.defaultErrorResponses
);

chai.use(chaiString);

const testAddress = "X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH";

const transactionStatusCodeSuccess = "tesSUCCESS";
const transactionStatusCodeFailure = "tecFAILURE";

const transactionHash = "DEADBEEF";

describe("Default Xpring Client", function(): void {
  it("Get Account Balance - successful response", async function() {
    // GIVEN a DefaultXpringClient.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient);

    // WHEN the balance for an account is requested.
    const balance = await xpringClient.getBalance(testAddress);

    // THEN the balance is returned.
    assert.exists(balance);
  });

  it("Get Account Balance - classic address", function(done) {
    // GIVEN a XpringClient and a classic address
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient);
    const classicAddress = "rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn";

    // WHEN the balance for an account is requested THEN an error to use X-Addresses is thrown.
    xpringClient.getBalance(classicAddress).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(error.message, XpringClientErrorMessages.xAddressRequired);
      done();
    });
  });

  it("Get Account Balance - error", function(done) {
    // GIVEN a XpringClient which wraps an erroring network client.
    const xpringClient = new DefaultXpringClient(fakeErroringNetworkClient);

    // WHEN a balance is requested THEN an error is propagated.
    xpringClient.getBalance(testAddress).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(error, FakeNetworkClientResponses.defaultError);
      done();
    });
  });

  it("Get Account Balance - malformed response, no balance", function(done) {
    // GIVEN a XpringClient which wraps a network client with a malformed response.
    const accountInfoResponse = FakeNetworkClientResponses.defaultAccountInfoResponse();
    accountInfoResponse.setBalance(undefined);
    const fakeNetworkClientResponses = new FakeNetworkClientResponses(
      accountInfoResponse
    );
    const fakeNetworkClient = new FakeNetworkClient(fakeNetworkClientResponses);
    const xpringClient = new DefaultXpringClient(fakeNetworkClient);

    // WHEN a balance is requested THEN an error is propagated.
    xpringClient.getBalance(testAddress).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(error.message, XpringClientErrorMessages.malformedResponse);
      done();
    });
  });

  it("Send XRP Transaction - success with BigInt", async function() {
    // GIVEN a XpringClient, a wallet, and a BigInt denomonated amount.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient);
    const wallet = (Wallet.generateRandomWallet() as WalletGenerationResult)
      .wallet;
    const destinationAddress =
      "X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH";
    const amount = BigInt("10");

    // WHEN the account makes a transaction.
    const transactionHash = await xpringClient.send(
      amount,
      destinationAddress,
      wallet
    );

    // THEN the transaction hash exists and is the expected hash
    const expectedTransactionBlob = FakeNetworkClientResponses.defaultSubmitSignedTransactionResponse().getTransactionBlob();
    const expectedTransactionHash = Utils.transactionBlobToTransactionHash(
      expectedTransactionBlob
    );

    assert.exists(transactionHash);
    assert.strictEqual(transactionHash, expectedTransactionHash);
  });

  it("Send XRP Transaction - success with number", async function() {
    // GIVEN a XpringClient, a wallet, and a number denominated amount.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient);
    const wallet = (Wallet.generateRandomWallet() as WalletGenerationResult)
      .wallet;
    const destinationAddress =
      "X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH";
    const amount = 10;

    // WHEN the account makes a transaction.
    const transactionHash = await xpringClient.send(
      amount,
      destinationAddress,
      wallet
    );

    // THEN the transaction hash exists and is the expected hash
    const expectedTransactionBlob = FakeNetworkClientResponses.defaultSubmitSignedTransactionResponse().getTransactionBlob();
    const expectedTransactionHash = Utils.transactionBlobToTransactionHash(
      expectedTransactionBlob
    );

    assert.exists(transactionHash);
    assert.strictEqual(transactionHash, expectedTransactionHash);
  });

  it("Send XRP Transaction - success with string", async function() {
    // GIVEN a XpringClient, a wallet, and a numeric string denominated amount.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient);
    const wallet = (Wallet.generateRandomWallet() as WalletGenerationResult)
      .wallet;
    const destinationAddress =
      "X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH";
    const amount = "10";

    // WHEN the account makes a transaction.
    const transactionHash = await xpringClient.send(
      amount,
      destinationAddress,
      wallet
    );

    // THEN the transaction hash exists and is the expected hash
    const expectedTransactionBlob = FakeNetworkClientResponses.defaultSubmitSignedTransactionResponse().getTransactionBlob();
    const expectedTransactionHash = Utils.transactionBlobToTransactionHash(
      expectedTransactionBlob
    );

    assert.exists(transactionHash);
    assert.strictEqual(transactionHash, expectedTransactionHash);
  });

  it("Send XRP Transaction - failure with invalid string", function(done) {
    // GIVEN a XpringClient, a wallet and an amount that is invalid.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient);
    const wallet = (Wallet.generateRandomWallet() as WalletGenerationResult)
      .wallet;
    const destinationAddress =
      "X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH";
    const amount = "not_a_number";

    // WHEN the account makes a transaction THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch(error => {
      assert.typeOf(error, "Error");
      done();
    });
  });

  it("Send XRP Transaction - get fee failure", function(done) {
    // GIVEN a XpringClient which will fail to retrieve a fee.
    const feeFailureResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultError,
      FakeNetworkClientResponses.defaultSubmitSignedTransactionResponse()
    );
    const feeFailingNetworkClient = new FakeNetworkClient(feeFailureResponses);
    const xpringClient = new DefaultXpringClient(feeFailingNetworkClient);
    const wallet = (Wallet.generateRandomWallet() as WalletGenerationResult)
      .wallet;
    const destinationAddress =
      "X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH";
    const amount = BigInt("10");

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(
        error.message,
        FakeNetworkClientResponses.defaultError.message
      );
      done();
    });
  });

  it("Send XRP Transaction - failure with classic address", function(done) {
    // GIVEN a XpringClient, a wallet, and a classic address as the destination.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient);
    const wallet = (Wallet.generateRandomWallet() as WalletGenerationResult)
      .wallet;
    const destinationAddress = "rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn";
    const amount = BigInt("10");

    // WHEN the account makes a transaction THEN an error is thrown.
    xpringClient.send(amount, destinationAddress, wallet).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(error.message, XpringClientErrorMessages.xAddressRequired);
      done();
    });
  });

  it("Send XRP Transaction - get account info failure", function(done) {
    // GIVEN a XpringClient which will fail to retrieve account info.
    const feeFailureResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultError,
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitSignedTransactionResponse()
    );
    const feeFailingNetworkClient = new FakeNetworkClient(feeFailureResponses);
    const xpringClient = new DefaultXpringClient(feeFailingNetworkClient);
    const wallet = (Wallet.generateRandomWallet() as WalletGenerationResult)
      .wallet;
    const destinationAddress =
      "X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH";
    const amount = BigInt("10");

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(
        error.message,
        FakeNetworkClientResponses.defaultError.message
      );
      done();
    });
  });

  it("Send XRP Transaction - get latest ledger sequence failure", function(done) {
    // GIVEN a XpringClient which will fail to retrieve account info.
    const feeFailureResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeNetworkClientResponses.defaultError
    );
    const feeFailingNetworkClient = new FakeNetworkClient(feeFailureResponses);
    const xpringClient = new DefaultXpringClient(feeFailingNetworkClient);
    const wallet = (Wallet.generateRandomWallet() as WalletGenerationResult)
      .wallet;
    const destinationAddress =
      "X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH";
    const amount = BigInt("10");

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(
        error.message,
        FakeNetworkClientResponses.defaultError.message
      );
      done();
    });
  });

  it("Send XRP Transaction - submission failure", function(done) {
    // GIVEN a XpringClient which will to submit a transaction.
    const feeFailureResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultError
    );
    const feeFailingNetworkClient = new FakeNetworkClient(feeFailureResponses);
    const xpringClient = new DefaultXpringClient(feeFailingNetworkClient);
    const wallet = (Wallet.generateRandomWallet() as WalletGenerationResult)
      .wallet;
    const destinationAddress =
      "X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH";
    const amount = BigInt("10");

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(
        error.message,
        FakeNetworkClientResponses.defaultError.message
      );
      done();
    });
  });

  it("Get Transaction Status - Unvalidated Transaction and Failure Code", async function() {
    // GIVEN a XpringClient which will return an unvalidated transaction with a failure code.
    const transactionStatusResponse = new TransactionStatusResponse();
    transactionStatusResponse.setValidated(false);
    transactionStatusResponse.setTransactionStatusCode(
      transactionStatusCodeFailure
    );
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeNetworkClientResponses.defaultLedgerSequenceResponse(),
      transactionStatusResponse
    );
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses);
    const xpringClient = new DefaultXpringClient(fakeNetworkClient);

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      transactionHash
    );

    // THEN the status is pending.
    assert.deepEqual(transactionStatus, TransactionStatus.Pending);
  });

  it("Get Transaction Status - Unvalidated Transaction and Success Code", async function() {
    // GIVEN a XpringClient which will return an unvalidated transaction with a success code.
    const transactionStatusResponse = new TransactionStatusResponse();
    transactionStatusResponse.setValidated(false);
    transactionStatusResponse.setTransactionStatusCode(
      transactionStatusCodeSuccess
    );
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeNetworkClientResponses.defaultLedgerSequenceResponse(),
      transactionStatusResponse
    );
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses);
    const xpringClient = new DefaultXpringClient(fakeNetworkClient);

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      transactionHash
    );

    // THEN the status is pending.
    assert.deepEqual(transactionStatus, TransactionStatus.Pending);
  });

  it("Get Transaction Status - Validated Transaction and Failure Code", async function() {
    // GIVEN a XpringClient which will return an validated transaction with a failure code.
    const transactionStatusResponse = new TransactionStatusResponse();
    transactionStatusResponse.setValidated(true);
    transactionStatusResponse.setTransactionStatusCode(
      transactionStatusCodeFailure
    );
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeNetworkClientResponses.defaultLedgerSequenceResponse(),
      transactionStatusResponse
    );
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses);
    const xpringClient = new DefaultXpringClient(fakeNetworkClient);

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      transactionHash
    );

    // THEN the status is failed.
    assert.deepEqual(transactionStatus, TransactionStatus.Failed);
  });

  it("Get Transaction Status - Validated Transaction and Success Code", async function() {
    // GIVEN a XpringClient which will return an validated transaction with a success code.
    const transactionStatusResponse = new TransactionStatusResponse();
    transactionStatusResponse.setValidated(true);
    transactionStatusResponse.setTransactionStatusCode(
      transactionStatusCodeSuccess
    );
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeNetworkClientResponses.defaultLedgerSequenceResponse(),
      transactionStatusResponse
    );
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses);
    const xpringClient = new DefaultXpringClient(fakeNetworkClient);

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      transactionHash
    );

    // THEN the status is succeeded.
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded);
  });

  it("Get Transaction Status - Node Error", function(done) {
    // GIVEN a XpringClient which will error when a transaction status is requested.
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeNetworkClientResponses.defaultLedgerSequenceResponse(),
      FakeNetworkClientResponses.defaultError
    );
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses);
    const xpringClient = new DefaultXpringClient(fakeNetworkClient);

    // WHEN the transaction status is retrieved THEN an error is thrown.
    xpringClient.getTransactionStatus(transactionHash).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(
        error.message,
        FakeNetworkClientResponses.defaultError.message
      );
      done();
    });
  });
});
