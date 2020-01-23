# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Add an additional boolean parameter to `XpringClient`'s constructor which allows toggling between protocol buffer implementations.

### Fixed
- Implement `XpringClient`'s `getBalance` method using rippled's protocol buffers. 
- Implement `XpringClientDecorator`'s `getRawTransactionStatusMethod` using rippled's protocol buffers. 
