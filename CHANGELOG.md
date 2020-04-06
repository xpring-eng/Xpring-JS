# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 4.0.0 - April 6, 2020

# Added
- `XRPTransaction` contains additional synthetic fields to represent the timestamp and hash of the transaction.

## Changed
- `XRPClient` requires a new parameter in it's constructor that identifies the network it is attached to.
- `IlpClient` methods now throw `IlpError`s if something goes wrong during the call
    (either client side or server side).
    This is only breaking if users are handling special error cases, which were previously `grpc.ServiceError`s when
    calling from node.js, and `grpc-web.Error`s in the browser.

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
- Fixed a bug in `DefaultIlpClient`. "Bearer " prefix was not being prepended to auth tokens, which caused authentication issues on Hermes.
	- "Bearer " prefix now gets prepended to auth tokens, if it is not already there

## 2.0.0 - March 16, 2020
- `XpringClient` is removed from XpringKit. This class has been deprecated since 1.5.0. Clients should use `XRPClient` instead.
- `XRPClient` now uses [rippled's protocol buffer API](https://github.com/ripple/rippled/pull/3254) rather than the legacy API. Users who wish to use the legacy API should pass `false` for `useNewProtocolBuffers` in the constructor.
- Introduces a breaking change to `IlpClient` API.
	- `IlpClient.getBalance` now returns an `AccountBalance` instead of a protobuf generated `GetBalanceResponse`.
	- `IlpClient.send` has been changed to `IlpClient.sendPayment` to better align with other versions of the Xpring SDK
	- `IlpClient.sendPayment` now consumes a `PaymentRequest` instead of individual parameters, and now returns a `PaymentResult` instead of a protobuf generated `SendPaymentResponse`
- Non-breaking `IlpClient` changes
	- The web network client now allows browser cookies to be forwarded with network calls

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
