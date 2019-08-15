import { assert } from "chai";
import XpringClient from "../src/xpring-client";
import "mocha";

describe("Xpring Client", function() {
  /**
   * Placeholder test to bootstrap project.
   * TODO(keefertaylor): Delete this test.
   */
  it("Client can be constructed", function() {
    let client = new XpringClient();
    assert.exists(client);
  });
});
