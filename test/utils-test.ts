import { Utils } from "xpring-common-js";
import { assert } from "chai";
import "mocha";

/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

describe("Utils", function(): void {
  it("isValidAddress() - Valid Classic Address", function(): void {
    // GIVEN a valid classic address.
    const address = "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1";

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address);

    // THEN the address is deemed valid.
    assert.isTrue(validAddress);
  });

  it("isValidAddress() - Valid X-Address", function(): void {
    // GIVEN a valid X-address.
    const address = "XVLhHMPHU98es4dbozjVtdWzVrDjtV18pX8yuPT7y4xaEHi";

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address);

    // THEN the address is deemed valid.
    assert.isTrue(validAddress);
  });

  it("isValidAddress() - Wrong Alphabet", function(): void {
    // GIVEN a base58check address encoded in the wrong alphabet.
    const address = "1EAG1MwmzkG6gRZcYqcRMfC17eMt8TDTit";

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address);

    // THEN the address is deemed invalid.
    assert.isFalse(validAddress);
  });

  it("isValidAddress() - Invalid Classic Address Checksum", function(): void {
    // GIVEN a classic address which fails checksumming in base58 encoding.
    const address = "rU6K7V3Po4sBBBBBaU29sesqs2qTQJWDw1";

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address);

    // THEN the address is deemed invalid.
    assert.isFalse(validAddress);
  });

  it("isValidAddress() - Invalid X-Address Checksum", function(): void {
    // GIVEN an X-address which fails checksumming in base58 encoding.
    const address = "XVLhHMPHU98es4dbozjVtdWzVrDjtV18pX8yuPT7y4xaEHI";

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address);

    // THEN the address is deemed invalid.
    assert.isFalse(validAddress);
  });

  it("isValidAddress() - Invalid Characters", function(): void {
    // GIVEN a base58check address which has invalid characters.
    const address = "rU6K7V3Po4sBBBBBaU@#$%qs2qTQJWDw1";

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address);

    // THEN the address is deemed invalid.
    assert.isFalse(validAddress);
  });

  it("isValidAddress() - Too Long", function(): void {
    // GIVEN a base58check address which has invalid characters.
    const address =
      "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1";

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address);

    // THEN the address is deemed invalid.
    assert.isFalse(validAddress);
  });

  it("isValidAddress() - Too Short", function(): void {
    // GIVEN a base58check address which has invalid characters.
    const address = "rU6K7V3Po4s2qTQJWDw1";

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address);

    // THEN the address is deemed invalid.
    assert.isFalse(validAddress);
  });

  it("encodeXAddress() - Address and Tag", function(): void {
    // GIVEN a valid classic address and a tag.
    const address = "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1";
    const tag = 12345;

    // WHEN they are encoded to an x-address.
    const xAddress = Utils.encodeXAddress(address, tag);

    // THEN the result is as expected.
    assert.strictEqual(
      xAddress,
      "XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUvtU3HnooQDgBnUpQT"
    );
  });

  it("encodeXAddress() - Address Only", function(): void {
    // GIVEN a valid classic address.
    const address = "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1";

    // WHEN it is encoded to an x-address.
    const xAddress = Utils.encodeXAddress(address, undefined);

    // THEN the result is as expected.
    assert.strictEqual(
      xAddress,
      "XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUFyQVMzRrMGUZpokKH"
    );
  });

  it("encodeXAddress() - Invalid Address", function(): void {
    // GIVEN an invalid address.
    const address = "xrp";

    // WHEN it is encoded to an x-address.
    const xAddress = Utils.encodeXAddress(address, undefined);

    // THEN the result is undefined.
    assert.isUndefined(xAddress);
  });

  it("decodeXAddress() - Valid Address with Tag", function(): void {
    // GIVEN an x-address that encodes an address and a tag.
    const address = "XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUvtU3HnooQDgBnUpQT";

    // WHEN it is decoded to an classic address
    const xAddress = Utils.decodeXAddress(address);

    // Then the decoded address and tag as are expected.
    assert.strictEqual(xAddress!.address, "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1");
    assert.strictEqual(xAddress!.tag, 12345);
  });

  it("decodeXAddress() - Valid Address without Tag", function(): void {
    // GIVEN an x-address that encodes an address and no tag.
    const address = "XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUFyQVMzRrMGUZpokKH";

    // WHEN it is decoded to an classic address
    const xAddress = Utils.decodeXAddress(address);

    // Then the decoded address and tag as are expected.
    assert.strictEqual(xAddress!.address, "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1");
    assert.isUndefined(xAddress!.tag);
  });

  it("decodeXAddress() - Invalid Address", function(): void {
    // GIVEN an invalid address
    const address = "xrp";

    // WHEN it is decoded to an classic address
    const xAddress = Utils.decodeXAddress(address);

    // Then the decoded address is undefined.
    assert.isUndefined(xAddress);
  });
});
