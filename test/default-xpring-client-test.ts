import { assert } from "chai";

import chai from "chai";
import chaiString from "chai-string";
import DefaultXpringClient, {
  XpringClientErrorMessages
} from "../src/default-xpring-client";
import "mocha";

chai.use(chaiString);

const testAddress = "X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH";

describe("Default Xpring Client", function(): void {
  it("Get Account Balance - successful response", async function(): Promise<void> {
    // GIVEN a LegacyDefaultXpringClient.
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
      assert.equal(
        error.message,
        LegacyXpringClientErrorMessages.xAddressRequired
      );
      done();
    });
  });

  it("Get Account Balance - error", function(done) {
    // GIVEN a XpringClient which wraps an erroring network client.
    const xpringClient = new DefaultXpringClient(fakeErroringNetworkClient);

    // WHEN a balance is requested THEN an error is propagated.
    xpringClient.getBalance(testAddress).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(error, FakeLegacyNetworkClientResponses.defaultError);
      done();
    });
  });

  it("Get Account Balance - malformed response, no balance", function(done) {
    // GIVEN a XpringClient which wraps a network client with a malformed response.
    const accountInfoResponse = FakeLegacyNetworkClientResponses.defaultAccountInfoResponse();
    accountInfoResponse.setBalance(undefined);
    const fakeNetworkClientResponses = new FakeLegacyNetworkClientResponses(
      accountInfoResponse
    );
    const fakeNetworkClient = new FakeNetworkClient(fakeNetworkClientResponses);
    const xpringClient = new DefaultXpringClient(fakeNetworkClient);

    // WHEN a balance is requested THEN an error is propagated.
    xpringClient.getBalance(testAddress).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(
        error.message,
        LegacyXpringClientErrorMessages.malformedResponse
      );
      done();
    });
  });
});
