# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
