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
  it("Get Account Balance - successful response", function(done) {
    // GIVEN a LegacyDefaultXpringClient.
    const xpringClient = new DefaultXpringClient();

    // WHEN the balance for an account is requested THEN an an unimplemented error is thrown.
    xpringClient.getBalance(testAddress).catch(error => {
      assert.typeOf(error, "Error");
      assert.equal(error.message, XpringClientErrorMessages.unimplemented);
      done();
    });
  });
});
