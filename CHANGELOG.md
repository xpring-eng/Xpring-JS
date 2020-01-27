# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Add an additional boolean parameter to `XpringClient`'s constructor which allows toggling between protocol buffer implementations.
- Switch the protocol buffer generator to gRPC-Web instead of gRPC-Node for cross environment compatability with web and node.
- Add XMLHttpRequest to the global namespace for compatability with gRPC-Web.
- Switch BigInt to use the big-integer polyfill lib.

### Fixed
- Implement `XpringClient`'s `getBalance` method using rippled's protocol buffers.
- Implement `XpringClient`'s `getRawTransactionStatus` method using rippled's protocol buffers.
- Implement `XpringClient`'s `getTransactionStatus` method using rippled's protocol buffers.
