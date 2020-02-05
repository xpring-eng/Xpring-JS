/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Utils } from '../src/index'

describe('utils', (): void => {
  it('isValidAddress() - Valid Classic Address', (): void => {
    // GIVEN a valid classic address.
    const address = 'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1'

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address)

    // THEN the address is deemed valid.
    expect(validAddress).toEqual(true)
  })

  it('isValidAddress() - Valid X-Address', (): void => {
    // GIVEN a valid X-address.
    const address = 'XVLhHMPHU98es4dbozjVtdWzVrDjtV18pX8yuPT7y4xaEHi'

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address)

    // THEN the address is deemed valid.
    expect(validAddress).toEqual(true)
  })

  it('isValidAddress() - Wrong Alphabet', (): void => {
    // GIVEN a base58check address encoded in the wrong alphabet.
    const address = '1EAG1MwmzkG6gRZcYqcRMfC17eMt8TDTit'

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address)

    // THEN the address is deemed invalid.
    expect(validAddress).toEqual(false)
  })

  it('isValidAddress() - Invalid Classic Address Checksum', (): void => {
    // GIVEN a classic address which fails checksumming in base58 encoding.
    const address = 'rU6K7V3Po4sBBBBBaU29sesqs2qTQJWDw1'

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address)

    // THEN the address is deemed invalid.
    expect(validAddress).toEqual(false)
  })

  it('isValidAddress() - Invalid X-Address Checksum', (): void => {
    // GIVEN an X-address which fails checksumming in base58 encoding.
    const address = 'XVLhHMPHU98es4dbozjVtdWzVrDjtV18pX8yuPT7y4xaEHI'

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address)

    // THEN the address is deemed invalid.
    expect(validAddress).toEqual(false)
  })

  it('isValidAddress() - Invalid Characters', (): void => {
    // GIVEN a base58check address which has invalid characters.
    const address = 'rU6K7V3Po4sBBBBBaU@#$%qs2qTQJWDw1'

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address)

    // THEN the address is deemed invalid.
    expect(validAddress).toEqual(false)
  })

  it('isValidAddress() - Too Long', (): void => {
    // GIVEN a base58check address which has invalid characters.
    const address =
      'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1'

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address)

    // THEN the address is deemed invalid.
    expect(validAddress).toEqual(false)
  })

  it('isValidAddress() - Too Short', (): void => {
    // GIVEN a base58check address which has invalid characters.
    const address = 'rU6K7V3Po4s2qTQJWDw1'

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address)

    // THEN the address is deemed invalid.
    expect(validAddress).toEqual(false)
  })

  it('encodeXAddress() - Mainnet Address and Tag', (): void => {
    // GIVEN a valid classic address on MainNet and a tag.
    const address = 'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1'
    const tag = 12345
    const isTest = false

    // WHEN they are encoded to an x-address.
    const xAddress = Utils.encodeXAddress(address, tag, isTest)

    // THEN the result is as expected.
    expect(xAddress).toEqual('XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUvtU3HnooQDgBnUpQT')
  })

  it('encodeXAddress() - TestNet Address and Tag', (): void => {
    // GIVEN a valid classic address on TestNet and a tag.
    const address = 'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1'
    const tag = 12345
    const isTest = true

    // WHEN they are encoded to an x-address.
    const xAddress = Utils.encodeXAddress(address, tag, isTest)

    // THEN the result is as expected.
    expect(xAddress).toEqual('TVsBZmcewpEHgajPi1jApLeYnHPJw82v9JNYf7dkGmWphmh')
  })

  it('encodeXAddress() - Address Only', (): void => {
    // GIVEN a valid classic address.
    const address = 'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1'

    // WHEN it is encoded to an x-address.
    const xAddress = Utils.encodeXAddress(address, undefined)

    // THEN the result is as expected.
    expect(xAddress).toEqual('XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUFyQVMzRrMGUZpokKH')
  })

  it('encodeXAddress() - Invalid Address', (): void => {
    // GIVEN an invalid address.
    const address = 'xrp'

    // WHEN it is encoded to an x-address.
    const xAddress = Utils.encodeXAddress(address, undefined)

    // THEN the result is undefined.
    expect(xAddress).toBeUndefined()
  })

  it('decodeXAddress() - Valid Mainnet Address with Tag', (): void => {
    // GIVEN an x-address that encodes an address and a tag.
    const address = 'XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUvtU3HnooQDgBnUpQT'

    // WHEN it is decoded to an classic address
    const classicAddress = Utils.decodeXAddress(address)

    // Then the decoded address and tag as are expected.
    expect(classicAddress!.address).toEqual(
      'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1',
    )
    expect(classicAddress!.tag).toEqual(12345)
    expect(classicAddress!.test).toEqual(false)
  })

  it('decodeXAddress() - Valid Testnet Address with Tag', (): void => {
    // GIVEN an x-address that encodes an address and a tag.
    const address = 'TVsBZmcewpEHgajPi1jApLeYnHPJw82v9JNYf7dkGmWphmh'

    // WHEN it is decoded to an classic address
    const classicAddress = Utils.decodeXAddress(address)

    // Then the decoded address and tag as are expected.
    expect(classicAddress!.address).toEqual(
      'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1',
    )
    expect(classicAddress!.tag).toEqual(12345)
    expect(classicAddress!.test).toEqual(true)
  })

  it('decodeXAddress() - Valid Address without Tag', (): void => {
    // GIVEN an x-address that encodes an address and no tag.
    const address = 'XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUFyQVMzRrMGUZpokKH'

    // WHEN it is decoded to an classic address
    const classicAddress = Utils.decodeXAddress(address)

    // Then the decoded address and tag as are expected.
    expect(classicAddress!.address).toEqual(
      'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1',
    )
    expect(classicAddress!.tag).toBeUndefined()
  })

  it('decodeXAddress() - Invalid Address', (): void => {
    // GIVEN an invalid address
    const address = 'xrp'

    // WHEN it is decoded to an classic address
    const classicAddress = Utils.decodeXAddress(address)

    // Then the decoded address is undefined.
    expect(classicAddress).toBeUndefined()
  })

  it('isValidXAddress() - Valid X-Address', (): void => {
    // GIVEN a valid X-Address.
    const address = 'XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUvtU3HnooQDgBnUpQT'

    // WHEN the address is validated for being an X-Address.
    const isValid = Utils.isValidXAddress(address)

    // THEN the address is reported as valid.
    expect(isValid).toEqual(true)
  })

  it('isValidXAddress() - Classic Address', (): void => {
    // GIVEN a valid classic address.
    const address = 'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1'

    // WHEN the address is validated for being an X-Address.
    const isValid = Utils.isValidXAddress(address)

    // THEN the address is reported as invalid.
    expect(isValid).toEqual(false)
  })

  it('isValidXAddress() - Invalid Address', (): void => {
    // GIVEN an invalid address.
    const address = 'xrp'

    // WHEN the address is validated for being an X-Address.
    const isValid = Utils.isValidXAddress(address)

    // THEN the address is reported as invalid.
    expect(isValid).toEqual(false)
  })

  it('isValidClassicAddress() - Valid X-Address', (): void => {
    // GIVEN a valid X-Address.
    const address = 'XVfC9CTCJh6GN2x8bnrw3LtdbqiVCUvtU3HnooQDgBnUpQT'

    // WHEN the address is validated for being a classic address.
    const isValid = Utils.isValidClassicAddress(address)

    // THEN the address is reported as invalid.
    expect(isValid).toEqual(false)
  })

  it('isValidClassicAddress() - Classic Address', (): void => {
    // GIVEN a valid classic address.
    const address = 'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1'

    // WHEN the address is validated for being a classic address.
    const isValid = Utils.isValidClassicAddress(address)

    // THEN the address is reported as valid.
    expect(isValid).toEqual(true)
  })

  it('isValidClassicAddress() - Invalid Address', (): void => {
    // GIVEN an invalid address.
    const address = 'xrp'

    // WHEN the address is validated for being a classic address.
    const isValid = Utils.isValidClassicAddress(address)

    // THEN the address is reported as invalid.
    expect(isValid).toEqual(false)
  })

  it('transactionBlobHex() - Valid transaction blob', (): void => {
    // GIVEN a transaction blob.
    const transactionBlobHex =
      '120000240000000561400000000000000168400000000000000C73210261BBB9D242440BA38375DAD79B146E559A9DFB99055F7077DA63AE0D643CA0E174473045022100C8BB1CE19DFB1E57CDD60947C5D7F1ACD10851B0F066C28DBAA3592475BC3808022056EEB85CC8CD41F1F1CF635C244943AD43E3CF0CE1E3B7359354AC8A62CF3F488114F8942487EDB0E4FD86190BF8DCB3AF36F608839D83141D10E382F805CD7033CC4582D2458922F0D0ACA6'

    // WHEN the transaction blob is converted to a hash.
    const transactionHash = Utils.transactionBlobToTransactionHash(
      transactionBlobHex,
    )

    // THEN the transaction blob is as expected.
    expect(transactionHash).toEqual(
      '7B9F6E019C2A79857427B4EF968D77D683AC84F5A880830955D7BDF47F120667',
    )
  })

  it('transactionBlobHex() - Invalid transaction blob', (): void => {
    // GIVEN an invalid transaction blob.
    const transactionBlobHex = 'xrp'

    // WHEN the transaction blob is converted to a hash.
    const transactionHash = Utils.transactionBlobToTransactionHash(
      transactionBlobHex,
    )

    // THEN the hash is undefined.
    expect(transactionHash).toBeUndefined()
  })
})
