[![CircleCI](https://img.shields.io/circleci/build/github/xpring-eng/Xpring-JS?style=flat-square)](https://circleci.com/gh/xpring-eng/xpring-js/tree/master)
[![CodeCov](https://img.shields.io/codecov/c/github/xpring-eng/xpring-js?style=flat-square)]((https://codecov.io/gh/xpring-eng/xpring-js))
[![Dependabot Status](https://img.shields.io/static/v1?label=Dependabot&message=enabled&color=success&style=flat-square&logo=dependabot)](https://dependabot.com)

*Read this in other languages: [日本語](README-ja.md).*

# Xpring-JS

Xpring-JS is the JavaScript client side library of the Xpring SDK.

## Features
Xpring-JS provides the following features:
- Wallet generation and derivation (Seed or HD Wallet based)
- Address validation
- Account balance retrieval
- Sending XRP payments

## Installation

Xpring-JS utilizes two components to access the Xpring Platform:
1) The Xpring-JS client side library (This library)
2) A server side component that handles requests from this library and proxies them to an XRP node

### Client Side Library
Xpring-JS is available as an NPM package. Simply install with:

```shell
$ npm i xpring-js
```

### Server Side Component
The server side component sends client-side requests to an XRP Node.

To get developers started right away, Xpring currently provides the server side component as a hosted service, which proxies requests from client side libraries to a a hosted XRP Node. Developers can reach the endpoint at:
```
grpc.xpring.tech:80
```

Xpring is working on building a zero-config way for XRP node users to deploy and use the adapter as an open-source component of [rippled](https://github.com/ripple/rippled). Watch this space!

## Usage

**Note:** Xpring SDK only works with the X-Address format. For more information about this format, see the [Utilities section](#utilities) and <http://xrpaddress.info>.

### Wallets
A wallet is a fundamental model object in XpringKit which provides key management, address derivation, and signing functionality. Wallets can be derived from either a seed or a mnemonic and derivation path. You can also choose to generate a new random HD wallet.

#### Wallet Derivation
Xpring-JS can derive a wallet from a seed or it can derive a hierarchical deterministic wallet (HDWallet) from a mnemonic and derivation path.

##### Hierarchical Deterministic Wallets
A hierarchical deterministic wallet is created using a mnemonic and a derivation path. Simply pass the mnemonic and derivation path to the wallet generation function. Note that you can omit the derivation path and have a default path be used instead.

```javascript
const { Wallet } = require("xpring-js");

const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

const hdWallet1 = Wallet.generateWalletFromMnemonic(mnemonic); // Has default derivation path
const hdWallet2 = Wallet.generateWalletFromMnemonic(mnemonic, Wallet.getDefaultDerivationPath()); // Same as hdWallet1

const hdWallet = Wallet.generateWalletFromMnemonic(mnemonic, "m/44'/144'/0'/0/1"); // Wallet with custom derivation path.
```

##### Seed Based Wallets
You can construct a seed based wallet by passing a base58check encoded seed string.

```javascript
const { Wallet } = require("xpring-js");

const seedWallet = Wallet.generateWalletFromSeed("snRiAJGeKCkPVddbjB3zRwiYDBm1M");
```

#### Wallet Generation
Xpring-JS can generate a new and random HD Wallet. The result of a wallet generation call is a tuple which contains the following:
- A randomly generated mnemonic
- The derivation path used, which is the default path
- A reference to the new wallet

```javascript
const { Wallet } = require("xpring-js");

// Generate a random wallet.
const generationResult = Wallet.generateRandomWallet();
const newWallet = generationResult.wallet

// Wallet can be recreated with the artifacts of the initial generation.
const copyOfNewWallet = Wallet.generateWalletFromMnemonic(generationResult.mnemonic, generationResult.derivationPath)
```

#### Wallet Properties
A generated wallet can provide its public key, private key, and address on the XRP ledger.

```javascript
const { Wallet } = require("xpring-js");

const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

const wallet = Wallet.generateWalletFromMnemonic(mnemonic);

console.log(wallet.getAddress()); // XVMFQQBMhdouRqhPMuawgBMN1AVFTofPAdRsXG5RkPtUPNQ
console.log(wallet.getPublicKey()); // 031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE
console.log(wallet.getPrivateKey()); // 0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4
```

#### Signing / Verifying

A wallet can also sign and verify arbitrary hex messages. Generally, users should use the functions on `XpringClient` to perform cryptographic functions rather than using these low level APIs.

```javascript
const { Wallet } = require("xpringkit-js");

const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const message = "deadbeef";

const wallet = Wallet.generateWalletFromMnemonic(mnemonic);

const signature = wallet.sign(message);
wallet.verify(message, signature); // true
```

### XpringClient

`XpringClient` is a gateway into the XRP Ledger. `XpringClient` is initialized with a single parameter, which is the URL of the remote adapter (see: ‘Server Side Component’ section above).

```javascript
const { XpringClient } = require("xpring-js");

const remoteURL = "grpc.xpring.tech:80";
const xpringClient = XpringClient.xpringClientWithEndpoint(remoteURL);
```

#### Retrieving a Balance

A `XpringClient` can check the balance of an account on the XRP Ledger.

```javascript
const { XpringClient } = require("xpring-js");

const remoteURL = "grpc.xpring.tech:80";
const xpringClient = new XpringClient(remoteURL);

const address = "X7u4MQVhU2YxS4P9fWzQjnNuDRUkP3GM6kiVjTjcQgUU3Jr";

const balance = await xpringClient.getBalance(address);
console.log(balance); // Logs a balance in drops of XRP
```

### Checking Transaction Status

A `XpringClient` can check the status of an transaction on the XRP Ledger.

Xpring-JS returns the following transaction states:
- `succeeded`: The transaction was successfully validated and applied to the XRP Ledger.
- `failed:` The transaction was successfully validated but not applied to the XRP Ledger. Or the operation will never be validated.
- `pending`: The transaction has not yet been validated, but may be validated in the future.
- `unknown`: The transaction status could not be determined.

**Note:** For more information, see [Reliable Transaction Submission](https://xrpl.org/reliable-transaction-submission.html) and [Transaction Results](https://xrpl.org/transaction-results.html).

These states are determined by the `TransactionStatus` enum.

```javascript
const { XpringClient } = require("xpring-js");

const remoteURL = "grpc.xpring.tech:80";
const xpringClient = new XpringClient(remoteURL);

const transactionHash = "9FC7D277C1C8ED9CE133CC17AEA9978E71FC644CE6F5F0C8E26F1C635D97AF4A";
const transactionStatus = xpringClient.getTransactionStatus(transactionHash); // TransactionStatus.Succeeded
```
**Note:** The example transactionHash may lead to a "Transaction not found." error because the TestNet is regularly reset, or the accessed node may only maintain one
month of history.  Recent transaction hashes can be found in the XRP Ledger Explorer: https://livenet.xrpl.org/

#### Sending XRP

A `XpringClient` can send XRP to other accounts on the XRP Ledger.

**Note:** The payment operation will block the calling thread until the operation reaches a definitive and irreversible success or failure state.

```javascript
const { Wallet, XRPAmount, XpringClient } = require("xpring-js");

const remoteURL = "grpc.xpring.tech:80";
const xpringClient = new XpringClient(remoteURL);

// Amount of XRP to send
const amount = BigInt("10");

// Destination address.
const destinationAddress = "X7u4MQVhU2YxS4P9fWzQjnNuDRUkP3GM6kiVjTjcQgUU3Jr";

// Wallet which will send XRP
const generationResult = Wallet.generateRandomWallet();
const senderWallet = generationResult.wallet;

const transactionHash = await xpringClient.send(amount, destinationAddress, senderWallet);
```
**Note:** The above example will yield an "Account not found." error because
the randomly generated wallet contains no XRP.

### Utilities
#### Address validation

The Utils object provides an easy way to validate addresses.

```javascript
const { Utils } = require("xpring-js")

const rippleClassicAddress = "rnysDDrRXxz9z66DmCmfWpq4Z5s4TyUP3G"
const rippleXAddress = "X7jjQ4d6bz1qmjwxYUsw6gtxSyjYv5iWPqPEjGqqhn9Woti";
const bitcoinAddress = "1DiqLtKZZviDxccRpowkhVowsbLSNQWBE8";

Utils.isValidAddress(rippleClassicAddress); // returns true
Utils.isValidAddress(rippleXAddress); // returns true
Utils.isValidAddress(bitcoinAddress); // returns false
```

You can also validate if an address is an X-Address or a classic address.
```javascript
const { Utils } = require("xpring-js")

const rippleClassicAddress = "rnysDDrRXxz9z66DmCmfWpq4Z5s4TyUP3G"
const rippleXAddress = "X7jjQ4d6bz1qmjwxYUsw6gtxSyjYv5iWPqPEjGqqhn9Woti";
const bitcoinAddress = "1DiqLtKZZviDxccRpowkhVowsbLSNQWBE8";

Utils.isValidXAddress(rippleClassicAddress); // returns false
Utils.isValidXAddress(rippleXAddress); // returns true
Utils.isValidXAddress(bitcoinAddress); // returns false

Utils.isValidClassicAddress(rippleClassicAddress); // returns true
Utils.isValidClassicAddress(rippleXAddress); // returns false
Utils.isValidClassicAddress(bitcoinAddress); // returns false
```

### X-Address Encoding

You can encode and decode X-Addresses with the SDK.

```javascript
const { Utils } = require("xpring-js")

const rippleClassicAddress = "rnysDDrRXxz9z66DmCmfWpq4Z5s4TyUP3G"
const tag = 12345;

// Encode an X-Address.
const xAddress = Utils.encodeXAddress(rippleClassicAddress, tag); // X7jjQ4d6bz1qmjwxYUsw6gtxSyjYv5xRB7JM3ht8XC4P45P

// Decode an X-Address.
const decodedClassicAddress = Utils.decodeXAddress(xAddress);

console.log(decodedClassicAddress.address); // rnysDDrRXxz9z66DmCmfWpq4Z5s4TyUP3G
console.log(decodedClassicAddress.tag); // 12345
```

# Contributing

Pull requests are welcome! To get started with building this library and opening pull requests, please see [contributing.md](CONTRIBUTING.md).

Thank you to all the users who have contributed to this library!

<a href="https://github.com/xpring-eng/xpring-js/graphs/contributors">
  <img src="https://contributors-img.firebaseapp.com/image?repo=xpring-eng/xpring-js" />
</a>

# License

Xpring SDK is available under the MIT license. See the [LICENSE](LICENSE) file for more info.
