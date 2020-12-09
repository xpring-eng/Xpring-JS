# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 5.4.0-beta.0 - 2020-12-9

- Dependency updates to fix browser compatibility problems.

### Added

- Exports `IssuedCurrencyClient`, an experimental client for working with issued currencies on the XRPL.
## 5.3.0 - 2020-11-17

### Added

- Method `sendXrp` of class `XrpClient` replaces now deprecated `send`. `sendXrp` returns a `TransactionResult` that
  contains more granular information about the final outcome of a submitted transaction.

- Method `sendXrpWithDetails` of class `XrpClient` replaces now deprecated `sendWithDetails`.  `sendXrpWithDetails` returns
  a `TransactionResult` that contains more granular infomration about the final outcome of a submitted transaction.

### Deprecated

- Method `send` of class `XrpClient` is deprecated and will be removed in two release cycles.
  Use `sendXrp` instead.

- Method `sendWithDetails` of class `XrpClient` is deprecated and will be removed in two release cycles.
  Use `sendXrpWithDetails` instead.

## 5.2.0 - 2020-10-15

- A new method `unauthorizeSendingAccount` is added to `XrpClient` which unauthorizes
  a sender to send XRP to the specified XRPL account that has enabled Deposit Authorization.
  (See https://xrpl.org/depositpreauth.html)

- A new method `authorizeSendingAccount` is added to `XrpClient` which authorizes a
  sender to send XRP to the specified XRPL account that has enabled Deposit Authorization.
  (See https://xrpl.org/depositpreauth.html)

## 5.1.2 - 2020-10-02

This release contains updated dependencies for stability and security.

## 5.1.1 - 2020-09-01

This release contains updated dependencies for stability and security.

## 5.1.0 - 2020-08-17

### Added

- A new method `enableDepositAuth` is added to `XrpClient` which enables Deposit Authorization for the specified XRPL account.
  (See https://xrpl.org/depositauth.html)

## 5.0.2 - 2020-08-01

This release contains updated dependencies for stability and security.

## 5.0.1 - 2020-07-15

This release contains updated dependencies for stability and security.

## 5.0.0 - 2020-06-25

This new release contains production ready classes for [PayID](https://payid.org).

This release also provides idiomatic capitalization. Previously, classes that were 'PayID' are now named as 'PayId' and classes which were named as 'XRP' are now named 'Xrp'.

## Removed

- `PayIDClient` was deprecated for two releases and has been removed. Use `PayIdClient` instead.
- `PayIDError` was deprecated for two releases and has been removed. Use `PayIdError` instead.
- `PayIDErrorType` was deprecated for two releases and has been removed. Use `PayIdErrorType` instead.
- `XRPPayIDClientInterface` was deprecated for two releases and has been removed. Use `XrpPayIdClientInterface` instead.
- `XRPPayIDClient` was deprecated for two releases and has been removed. Use `XrpPayIdClient` instead.
- `XRPLNetwork` was deprecated for two releases and has been removed. Use `XrplNetwork` instead.
- `memos` on `SendXrpDetails` was deprecated for two releases and has been removed. Use `memoList` instead.
- `XRPAccountSet` was deprecated for two releases and has been removed. Use `XrpAccountSet` instead.
- `XRPCurrencyAmount` was deprecated for two releases and has been removed. Use `XrpCurrencyAmount` instead.
- `XRPCurrency` was deprecated for two releases and has been removed. Use `XrpCurrency` instead.
- `XRPIssuedCurrency` was deprecated for two releases and has been removed. Use `XrpIssuedCurrency` instead.
- `XRPMemo` was deprecated for two releases and has been removed. Use `XrpMemo` instead.
- `XRPPathElement` was deprecated for two releases and has been removed. Use `XrpPathElement` instead.
- `XRPPath` was deprecated for two releases and has been removed. Use `XrpPath` instead.
- `XRPPayment` was deprecated for two releases and has been removed. Use `XrpPayment` instead.
- `XRPSigner` was deprecated for two releases and has been removed. Use `XrpSigner` instead.
- `XRPTransactionType` was deprecated for two releases and has been removed. Use `XrpTransactionType` instead.
- `XRPTransaction` was deprecated for two releases and has been removed. Use `XrpTransaction` instead.
- `XRPUtils` was deprecated for two releases and has been removed. Use `XrpUtils` instead.
- `XRPClient` was deprecated for two releases and has been removed. Use `XrpClient` instead.
- `XRPError` was deprecated for two releases and has been removed. Use `XrpError` instead.
- `XRPErrorType` was deprecated for two releases and has been removed. Use `XrpErrorType` instead.
- `XrpTransaction.account` and `XrpTransaction.sourceTag` were deprecated for two releases and have been removed.
  Use the X-address encoded field `sourceXAddress` instead.
- `XrpPayment.destination` and `XrpPayment.destinationTag` were deprecated for two releases and have been removed.
  Use the X-address encoded field `destinationXAddress` instead.

## 4.3.2 - 2020-06-17

## Added

- `SendXrpDetails` is exported for external use on `XrpClient` and `XpringClient`, allowing for memo data to be attached
  to the transaction when sending XRP.

## 4.3.1 - 2020-06-16

### Added

- `XRPPayment` and `XRPTransaction` now contain X-address representations of their address and tag fields.
  (See https://xrpaddress.info/)
- `XrplNetwork` replaces the now deprecated `XRPLNetwork`.
- `PayIdClient` replaces the now deprecated `PayIDClient`.
- `PayIdError` replaces the now deprecated `PayIDError`.
- `PayIdErrorType` replaces the now deprecated `PayIDErrorType`.
- `XrpPayIdClientInterface` replaces the now deprecated `XRPPayIDClientInterface`.
- `XrpPayIdClient` replaces the now deprecated `XRPPayIDClient`.
- A new value, `Unknown` is added to the `XpringErrorType` enum.
- A new field, `memosList` replaces `memos` on `SendXrpDetails`. `memos` is deprecated.
- `XrpAccountSet` replaces the now deprecated `XRPAccountSet`.
- `XrpCurrencyAmount` replaces the now deprecated `XRPCurrencyAmount`.
- `XrpCurrency` replaces the now deprecated `XRPCurrency`.
- `XrpIssuedCurrency` replaces the now deprecated `XRPIssuedCurrency`.
- `XrpMemo` replaces the now deprecated `XRPMemo`.
- `XrpPathElement` replaces the now deprecated `XRPPathElement`.
- `XrpPath` replaces the now deprecated `XRPPath`.
- `XrpPayment` replaces the now deprecated `XRPPayment`.
- `XrpSigner` replaces the now deprecated `XRPSigner`.
- `XRPTransactionType` now includes an `AccountSetValue`.
- `XrpTransactionType` replaces the now deprecated `XRPTransactionType`.
- `XrpTransaction` replaces the now deprecated `XRPTransaction`.
- A new method, `cryptoAddressForPayId`, replaces the now deprecated `addressForPayId` method in `PayIdClient`.
- A new method, `allAddressesForPayId`, is added to `PayIdClient`.
- `XrpUtils` replaces the now deprecated `XRPUtils`.
- `XrpClient` replaces the now deprecated `XRPClient`.
- `XrpError` replaces the now deprecated `XRPError`.
- `XrpErrorType` replaces the now deprecated `XRPErrorType`.

### Deprecated

- `XRPLNetwork` is deprecated. Use `XrplNetwork` instead.
- `PayIDClient` is deprecated. Use `PayIdClient` instead.
- `PayIDError` is deprecated. Use `PayIdError` instead.
- `PayIDErrorType` is deprecated. Use `PayIdErrorType` instead.
- `XRPPayIDClientInterface` is deprecated. Use `XrpPayIdClientInterface` instead.
- `XRPPayIDClient` is deprecated. Use `XrpPayIdClient` instead.
- `memos` on `SendXrpDetails` is deprecated. Use `memoList` instead.
- `XRPAccountSet` is deprecated. Use `XrpAccountSet` instead.
- `XRPCurrencyAmount` is deprecated. Use `XrpCurrencyAmount` instead.
- `XRPCurrency` is deprecated. Use `XrpCurrency` instead.
- `XRPIssuedCurrency` is deprecated. Use `XrpIssuedCurrency` instead.
- `XRPMemo` is deprecated. Use `XrpMemo` instead.
- `XRPPathElement` is deprecated. Use `XrpPathElement` instead.
- `XRPPath` is deprecated. Use `XrpPath` instead.
- `XRPPayment` is deprecated. Use `XrpPayment` instead.
- `XRPSigner` is deprecated. Use `XrpSigner` instead.
- `XRPTransactionType` is deprecated. Use `XrpTransactionType` instead.
- `XRPTransaction` is deprecated. Use `XrpTransaction` instead.
- `XRPTransaction.account` and `XRPTransaction.sourceTag` are deprecated.
  Please use the X-address encoded field `sourceXAddress` instead.
- `XRPPayment.destination` and `XRPPayment.destinationTag` are deprecated.
  Please use the X-address encoded field `destinationXAddress` instead.
- The `network` parameter passed to the constructor of `PayIdClient` is deprecated. Clients should favor calling the new `cryptoAddressForPayId` method which allows them to specify the network at request time.
- The `addressForPayId` on `PayIdClient` is deprecated. Use `cryptoAddressForPayId` instead.
- `XRPUtils` is deprecated. Use `XrpUtils` instead.
- `XRPClient` is deprecated. Use `XrpClient` instead.
- `XRPError` is deprecated. Use `XrpError` instead.
- `XRPErrorType` is deprecated. Use `XrpErrorType` instead.

## 4.3.0 - 2020-06-01

### Added

- A new method `getPayment` is added to `XRPClient` which allows retrieval of a payment transaction by hash.

## 4.2.9 - 2020-05-17

This fix release fixes a build issue when using Xpring-JS with typescript.

## 4.2.8 - 2020-05-15

This minor release fixes a bug in which incomplete transaction history was being returned from `paymentHistory`.

## 4.2.7 - 2020-05-06

This minor release fixes a typescript compilation failure.

## 4.2.6 - May 6, 2020

This minor release improves on existing features and fixes a typescript compilation failure.

## 4.2.5 - May 6, 2020

This minor release improves on existing features and fixes a typescript compilation failure.

## 4.2.4 - May 6, 2020

This minor release improves on existing features and fixes a typescript compilation failure.

## 4.2.3 - April 30, 2020

# Added

- `xrpToDrops` and `dropsToXrp` conversion utilities available.

## 4.2.2 - April 24, 2020

# Added

- `XRPTransaction` contains additional field `deliveredAmount` to represent the actual delivered amount of a transaction.

## 4.2.1 - April 10, 2020

This build contains fixes for some experimental components.

## 4.2.0 - April 7, 2020

This build contains fixes for generated code that may have prevented earlier versions of the 4.x library from building.

## 4.1.0 - April 6, 2020

# Added

- `XRPTransaction` contains additional synthetic fields to represent the timestamp and hash of the transaction.

## 4.0.0 - April 6, 2020

## Changed

- `XRPClient` requires a new parameter in its constructor that identifies the network it is attached to.
- `IlpClient` methods now throw `IlpError`s if something goes wrong during the call
  (either client side or server side).
  This is only breaking if users are handling special error cases, which were previously `grpc.ServiceError`s when
  calling from node.js, and `grpc-web.Error`s in the browser.
- `XRPClient` methods now throw `XRPError`s if something goes wrong during the call.

## 3.0.4 - March 24, 2020

This release contains minor fixes for exception handling in PayID.

### Added

- Add a new `paymentHistory` method to `XRPClient`. This method allows clients to retrieve payment history for an address.

## 3.0.3 - March 24, 2020

This release contains minor fixes for exception handling in PayID.

## 3.0.2 - March 24, 2020

This release contains minor fixes for exception handling in PayID.

## 3.0.1 - March 24, 2020

This release contains minor fixes for exception handling in PayID.

## 3.0.0 - March 23, 2020

- Export ILP model objects. This was not done in earlier versions, so ILP functionality does not work between release 2.0.0 and 3.0.0
- `getTransactionStatus` has been reomved. Please use `getPaymentStatus` instead.

## 2.0.2 - March 19, 2020

- Adds XpringClient, which composes various services.
- Updates PayID implementation to use the proper headers.

## 2.0.1 - March 18, 2020

- Fixed a bug in `DefaultIlpClient`. "Bearer " prefix was not being prepended to auth tokens, which caused authentication issues on Hermes. - "Bearer " prefix now gets prepended to auth tokens, if it is not already there

## 2.0.0 - March 16, 2020

- `XpringClient` is removed from XpringKit. This class has been deprecated since 1.5.0. Clients should use `XRPClient` instead.
- `XRPClient` now uses [rippled's protocol buffer API](https://github.com/ripple/rippled/pull/3254) rather than the legacy API. Users who wish to use the legacy API should pass `false` for `useNewProtocolBuffers` in the constructor.
- Introduces a breaking change to `IlpClient` API. - `IlpClient.getBalance` now returns an `AccountBalance` instead of a protobuf generated `GetBalanceResponse`. - `IlpClient.send` has been changed to `IlpClient.sendPayment` to better align with other versions of the Xpring SDK - `IlpClient.sendPayment` now consumes a `PaymentRequest` instead of individual parameters, and now returns a `PaymentResult` instead of a protobuf generated `SendPaymentResponse`
- Non-breaking `IlpClient` changes - The web network client now allows browser cookies to be forwarded with network calls

## 1.6.0 - March 12, 2020

This release contains deprecations for the `XpringClient` class and the `getTransactionStatus` method. Clients should prefer to use `XRPClient` and `getPaymentStatus` respectively.

#### Added

- A new class, `XRPClient` is added which contains the functionality of the now deprecated XpringClient.
- A new `getPaymentStatus` is added which retrieves the status of payment transactions.

#### Deprecated

- `XpringClient` is deprecated. Please use `XRPClient` instead.
- `getTransactionStatus` is deprecated. Please use `getPaymentStatus` instead.

## 1.5.1 - March 4, 2020

This version allows browsers using xpring-js to include an Authorization header in gRPC requests.

## 1.5.0 - March 4, 2020

This version enables ILP functionality through `IlpClient`.

## 1.4.0 - Feb 28, 2020

This version uses new protocol buffers from rippled which have breaking changes in them. Specifically, the breaking changes include:

- Use numeric `string` types rather than `number` types when working with 64 bit numbers
- Re-ordering and repurposing of fields in order to add additional layers of abstraction
- Change package from `rpc.v1` to `org.xrpl.rpc.v1`

This change is transparent to public API users. However, clients will need to connect to a rippled node which is built at any commit after [#3254](https://github.com/ripple/rippled/pull/3254).

## 1.3.2 - Feb 05, 2020

This fix release adds a missing export.

### Added

- Export the `TransactionStatus` enum so client libraries can consume it.

## 1.3.1 - Jan 30, 2020

This release fixes an incorrectly formatted package-lock.json that was published in the 1.3.0 release.

## 1.3.0 - Jan 30, 2020

This release adds support for the new rippled protocol buffers and adds browser compatibility support.

### New Protocol Buffers from rippled

rippled implemented protocol buffer support natively, which uses a new and incompatible set of protocol buffers. The implementation in rippled was completed in: ripple/rippled#3159. Xpring-JS is now capable of using these protocol buffers. This change is opt-in and non-breaking.

To switch to these protocol buffers, pass `true` to the `useNewProtocolBuffer` parameter in `XpringClient`'s constructor. The default for this field is false. The remote rippled node must have gRPC enabled. Additionally, when using this library in a browser, users are required to use the proxy based method as described in the [`grpc-web` documentation](https://www.npmjs.com/package/grpc-web).

### Browser Compatibility

This library is now compatible with web browsers. Internally, the library makes different network requests when in the browser. Users can force these request types in the node environment by passing `true` for the `forceWeb` parameter in `XpringClient`'s constructor.

This boolean parameter is intended for compatibility testing only. This change is opt-in and non-breaking. This parameter will be removed in the future when this library has compatibility with browser based testing.

This change also adds a BigInteger polyfill to maximize browser compatibility.

### Added

- Add an additional boolean parameter to `XpringClient`'s constructor which allows toggling between protocol buffer implementations.
- Add an additional boolean parameter to `XpringClient`'s constructor which allows toggling between node / web compatible network requests.
- Switch BigInt to use the big-integer polyfill lib.

### Fixed

- Implement `XpringClient`'s `getBalance` method using rippled's protocol buffers.
- Implement `XpringClient`'s `getRawTransactionStatus` method using rippled's protocol buffers.
- Implement `XpringClient`'s `getTransactionStatus` method using rippled's protocol buffers.
- Implement `XpringClient`'s `send` method using rippled's protocol buffers.
