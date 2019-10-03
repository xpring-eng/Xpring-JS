[![CircleCI](https://img.shields.io/circleci/build/github/xpring-eng/Xpring-JS/master?style=flat&token=8f614950de4d2dc800bb51710667bbd90d82dda3)](https://circleci.com/gh/xpring-eng/Xpring-JS)
[![Coverage](https://coveralls.io/repos/github/xpring-eng/Xpring-JS/badge.svg?branch=master&t=DkDKCV)](https://coveralls.io/github/xpring-eng/Xpring-JS?branch=master)

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

console.log(wallet.getAddress()); // rHsMGQEkVNJmpGWs8XUBoTBiAAbwxZN5v3
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

A `XpringClient` can check the balance of an account on the ledger.

```javascript
const { XpringClient } = require("xpring-js");

const remoteURL = "grpc.xpring.tech:80";
const xpringClient = XpringClient.xpringClientWithEndpoint(remoteURL);

const address = "r3v29rxf54cave7ooQE6eE7G5VFXofKZT7";

const balance = await xpringClient.getBalance(address);
console.log(balance.getDrops()); // Logs a balance in drops of XRP
```

#### Sending XRP

A `XpringClient` can send XRP to other accounts on the ledger.

```javascript
const { Wallet, XRPAmount, XpringClient } = require("xpring-js");

const remoteURL = "grpc.xpring.tech:80";
const xpringClient = XpringClient.xpringClientWithEndpoint(remoteURL);

// Wallet which will send XRP
const senderWallet = Wallet.generateRandomWallet();

// Destination address.
const address = "r3v29rxf54cave7ooQE6eE7G5VFXofKZT7";

// Amount of XRP to send
const amount = new XRPAmount();
amount.setDrops("10");

const result = await xpringClient.send(senderWallet, amount, destinationAddress);
```

### Utilities
#### Address validation

The Utils object provides an easy way to validate addresses.

```javascript
const { Utils } = require("xpring-js")

const rippleAddress = "rnysDDrRXxz9z66DmCmfWpq4Z5s4TyUP3G";
const bitcoinAddress = "1DiqLtKZZviDxccRpowkhVowsbLSNQWBE8";

Utils.isValidAddress(rippleAddress); // returns true
Utils.isValidAddress(bitcoinAddress); // returns false
```

## Development
To get set up for development on Xpring-JS, use the following steps:

```shell
# Clone repository
$ git clone https://github.com/xpring-eng/xpring-js.git
$ cd xpring-js

# Pull submodules
$ git submodule init
$ git submodule update --remote

# Install Protocol Buffers
# OSX
$ brew install protobuf
# Linux
$ sudo apt install protobuf-compiler

# Install GRPC
$ brew tap grpc/grpc
$ brew install grpc

# Install required modules.
$ npm i

# Run tests And generate intermediate code artifacts)
$ npm test
```
