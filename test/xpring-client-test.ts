import { assert } from "chai";
import XpringClient from "../src/xpring-client";
import FakeNetworkClient from "./fakes/fake-network-client";
import "mocha";

const fakeNetworkClient = new FakeNetworkClient();
const testAddress = "rnJfS9ozTiMXrQPTU53vxAgy9XWo9nGYNh";

describe("Xpring Client", function(): void {
  it("Get Account Balance - successful response", async function() {
    // GIVEN a XpringClient.
    const xpringClient = new XpringClient(fakeNetworkClient);

    // WHEN the balance for an account is requested.
    const balance = await xpringClient.getBalance(testAddress);

    // THEN the balance is returned.
    assert.exists(balance);
    assert.exists(balance.getDrops());
  });
});
