import { assert } from "chai";
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
});
