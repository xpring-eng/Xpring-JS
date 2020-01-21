# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Modify `Signer`'s `signTransaction` method to return an array of signed bytes rather than a string based signature.


## [2.0.0] - 2019-02-15

### Added

The release migrates the protocol buffers in (xpring-common-protocol-buffers)[https://github.com/xpring-eng/xpring-common-protocol-buffers) to a 'legacy' namespace. These protocol buffers and methods will be removed at some point in the future.

This release adds support for (protocol buffers in rippled)[https://github.com/ripple/rippled/tree/develop/src/ripple/proto/rpc/v1]. These protocol buffers are the recommended alternative.

The protocol buffers from `rippled` are not compatible with the protocol buffers from `xpring-common-protocol-buffers`. That makes this a *breaking change*. Clients will need to migrate to new methods (see `breaking changes` below).

- Support for rippled protocol buffer serialization and signing.
- `Serializer`'s `transactionToJSON` method is renamed `legacyTransactionToJSON`. The `transactionToJSON` method now supports protocol buffers from rippled.
- `Signers`'s `signTransaction` method is renamed to `signLegacyTransaction`. The `signTransaction` method now supports protocol buffers from rippled.

### Breaking Changes

- Clients who called `Serializer`'s `transactionToJSON` should migrate to using the `legacyTransactionToJSON` method.
- Clients who called `Signers`'s `signTransaction` should migrate to using the `signLegacyTransaction` method.
