import { assert } from "chai";

import { Wallet, WalletGenerationResult, XRPAmount } from "xpring-common-js";

import chai from "chai";
import chaiString from "chai-string";
import XpringClient, { XpringClientErrorMessages } from "../src/xpring-client";
import {
  FakeNetworkClient,
  FakeNetworkClientResponses
} from "./fakes/fake-network-client";
import "mocha";

const fakeSucceedingNetworkClient = new FakeNetworkClient();
const fakeErroringNetworkClient = new FakeNetworkClient(
  FakeNetworkClientResponses.defaultErrorResponses
);

chai.use(chaiString);

const testAddress = "rnJfS9ozTiMXrQPTU53vxAgy9XWo9nGYNh";

describe("Xpring Client", function(): void {
  it("Get Account Balance - successful response", async function() {
    // GIVEN a XpringClient.
    const xpringClient = new XpringClient(fakeSucceedingNetworkClient);

    // WHEN the balance for an account is requested.
    const balance = await xpringClient.getBalance(testAddress);

    // THEN the balance is returned.
    assert.exists(balance);
    assert.exists(balance.getDrops());
  });

  it("Get Account Balance - error", function(done) {
    // GIVEN a XpringClient which wraps an erroring network client.
    const xpringClient = new XpringClient(fakeErroringNetworkClient);

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
    const xpringClient = new XpringClient(fakeNetworkClient);

    // WHEN a balance is requested THEN an error is propagated.
    xpringClient.getBalance(testAddress).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(error.message, XpringClientErrorMessages.malformedResponse);
      done();
    });
  });

  it("Send XRP Transaction - success", async function() {
    // GIVEN a XpringClient and a wallet.
    const xpringClient = new XpringClient(fakeSucceedingNetworkClient);
    const wallet = (Wallet.generateRandomWallet() as WalletGenerationResult)
      .wallet;
    const destinationAddress = "rUi8dmUEg8JM5Kc92TWvCcuHdA3Ng3NCe8";
    const amount = new XRPAmount();
    amount.setDrops("10");

    // WHEN the account makes a transaction.
    const submissionResult = await xpringClient.send(
      wallet,
      amount,
      destinationAddress
    );

    // THEN the transaction has a success code attached.
    const successCode = 0;
    assert.exists(submissionResult);
    assert.equal(submissionResult.getEngineResultCode(), successCode);
  });

  it("Send XRP Transaction - get fee failure", function(done) {
    // GIVEN a XpringClient which will fail to retrieve a fee.
    const feeFailureResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultError,
      FakeNetworkClientResponses.defaultSubmitSignedTransactionResponse()
    );
    const feeFailingNetworkClient = new FakeNetworkClient(feeFailureResponses);
    const xpringClient = new XpringClient(feeFailingNetworkClient);
    const wallet = (Wallet.generateRandomWallet() as WalletGenerationResult)
      .wallet;
    const destinationAddress = "rUi8dmUEg8JM5Kc92TWvCcuHdA3Ng3NCe8";
    const amount = new XRPAmount();
    amount.setDrops("10");

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(wallet, amount, destinationAddress).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(
        error.message,
        FakeNetworkClientResponses.defaultError.message
      );
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
    const xpringClient = new XpringClient(feeFailingNetworkClient);
    const wallet = (Wallet.generateRandomWallet() as WalletGenerationResult)
      .wallet;
    const destinationAddress = "rUi8dmUEg8JM5Kc92TWvCcuHdA3Ng3NCe8";
    const amount = new XRPAmount();
    amount.setDrops("10");

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(wallet, amount, destinationAddress).catch(error => {
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
    const xpringClient = new XpringClient(feeFailingNetworkClient);
    const wallet = (Wallet.generateRandomWallet() as WalletGenerationResult)
      .wallet;
    const destinationAddress = "rUi8dmUEg8JM5Kc92TWvCcuHdA3Ng3NCe8";
    const amount = new XRPAmount();
    amount.setDrops("10");

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(wallet, amount, destinationAddress).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(
        error.message,
        FakeNetworkClientResponses.defaultError.message
      );
      done();
    });
  });

  it("Send XRP Transaction - failed signing", function(done) {
    // GIVEN a malformed transaction that cannot be signed.
    const xpringClient = new XpringClient(fakeSucceedingNetworkClient);
    const wallet = (Wallet.generateRandomWallet() as WalletGenerationResult)
      .wallet;
    const destinationAddress = "invalid_xrp_address";
    const amount = new XRPAmount();
    amount.setDrops("10");

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(wallet, amount, destinationAddress).catch(error => {
      assert.typeOf(error, "Error");
      assert.startsWith(
        error.message,
        XpringClientErrorMessages.signingFailure
      );
      done();
    });
  });
});
