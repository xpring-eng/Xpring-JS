[![CircleCI](https://img.shields.io/circleci/build/github/xpring-eng/Xpring-JS?style=flat-square)](https://circleci.com/gh/xpring-eng/xpring-js/tree/master)
[![CodeCov](https://img.shields.io/codecov/c/github/xpring-eng/xpring-js?style=flat-square)]((https://codecov.io/gh/xpring-eng/xpring-js))
[![Dependabot Status](https://img.shields.io/static/v1?label=Dependabot&message=enabled&color=success&style=flat-square&logo=dependabot)](https://dependabot.com)

*Read this in other languages: [日本語](README-ja.md).*

# Xpring-JS

Xpring-JS is the JavaScript client side library of the Xpring SDK.

## Features
Xpring-JS provides the following features:
- XRP:
    - Wallet generation and derivation (Seed-based or HD Wallet-based)
    - Address validation
    - Account balance retrieval
    - Sending XRP payments
- Interledger (ILP):
    - Account balance retrieval
    - Send ILP Payments

## Installation

### Client Side Library
Xpring-JS is available as an NPM package. Simply install with:

```shell
$ npm i xpring-js
```

### rippled Node

Xpring SDK needs to communicate with a rippled node which has gRPC enabled. Consult the [rippled documentation](https://github.com/ripple/rippled#build-from-source) for details on how to build your own node.

To get developers started right away, Xpring currently provides nodes.

If you are using Xpring-JS in a node environment, use the following addresses to boostrap your application:
```
# Testnet
test.xrp.xpring.io:50051

# Mainnet
main.xrp.xpring.io:50051
```

If you are using Xpring-JS from within a browser, use the following addresses to boostrap your application:
```
#Testnet
https://envoy.test.xrp.xpring.io

#Mainnet
https://envoy.main.xrp.xpring.io
```

### Hermes Node
Xpring SDK's `IlpClient` needs to communicate with Xpring's ILP infrastructure through an instance of [Hermes](https://github.com/xpring-eng/hermes-ilp).

In order to connect to the Hermes instance that Xpring currently operates, you will need to create an ILP wallet [here](https://xpring.io/portal/ilp-wallet)

Once your wallet has been created, you can use the gRPC URL specified in your wallet, as well as your **access token** to check your balance
and send payments over ILP.

## Usage: XRP

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

A wallet can also sign and verify arbitrary hex messages. Generally, users should use the functions on `XRPClient` to perform cryptographic functions rather than using these low level APIs.

```javascript
const { Wallet } = require("xpring-js");

const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const message = "deadbeef";

const wallet = Wallet.generateWalletFromMnemonic(mnemonic);

const signature = wallet.sign(message);
wallet.verify(message, signature); // true
```

### XRPClient

`XRPClient` is a gateway into the XRP Ledger. `XRPClient` is initialized with a single parameter, which is the URL of the remote adapter (see: ‘Server Side Component’ section above).

```javascript
const { XRPClient, XRPLNetwork } = require("xpring-js");

const remoteURL = "test.xrp.xpring.io:50051"; // Testnet URL, use main.xrp.xpring.io:50051 for Mainnet
const xrpClient = new XRPClient(remoteURL, XRPLNetwork.Test);
```

#### Retrieving a Balance

An `XRPClient` can check the balance of an account on the XRP Ledger.

```javascript
const { XRPClient, XRPLNetwork } = require("xpring-js");

const remoteURL = "test.xrp.xpring.io:50051"; // Testnet URL, use main.xrp.xpring.io:50051 for Mainnet
const xrpClient = new XRPClient(remoteURL, XRPLNetwork.Test);

const address = "X7u4MQVhU2YxS4P9fWzQjnNuDRUkP3GM6kiVjTjcQgUU3Jr";

const balance = await xrpClient.getBalance(address);
console.log(balance); // Logs a balance in drops of XRP
```

### Checking Payment Status

An `XRPClient` can check the status of an payment on the XRP Ledger.

This method can only determine the status of [payment transactions](https://xrpl.org/payment.html) which do not have the partial payment flag ([tfPartialPayment](https://xrpl.org/payment.html#payment-flags)) set.

Xpring-JS returns the following transaction states:
- `succeeded`: The transaction was successfully validated and applied to the XRP Ledger.
- `failed:` The transaction was successfully validated but not applied to the XRP Ledger. Or the operation will never be validated.
- `pending`: The transaction has not yet been validated, but may be validated in the future.
- `unknown`: The transaction status could not be determined, the hash represented a non-payment type transaction, or the hash represented a transaction with the [tfPartialPayment](https://xrpl.org/payment.html#payment-flags) flag set.

**Note:** For more information, see [Reliable Transaction Submission](https://xrpl.org/reliable-transaction-submission.html) and [Transaction Results](https://xrpl.org/transaction-results.html).

These states are determined by the `TransactionStatus` enum.

```javascript
const { XRPClient, XRPLNetwork } = require("xpring-js");

const remoteURL = "test.xrp.xpring.io:50051"; // Testnet URL, use main.xrp.xpring.io:50051 for Mainnet
const xrpClient = new XRPClient(remoteURL, XRPLNetwork.Test);

const transactionHash = "9FC7D277C1C8ED9CE133CC17AEA9978E71FC644CE6F5F0C8E26F1C635D97AF4A";
const transactionStatus = xrpClient.getPaymentStatus(transactionHash); // TransactionStatus.Succeeded
```
**Note:** The example transactionHash may lead to a "Transaction not found." error because the Testnet is regularly reset, or the accessed node may only maintain one
month of history.  Recent transaction hashes can be found in the XRP Ledger Explorer: https://livenet.xrpl.org/

#### Payment history

An `XRPClient` can return a list of payments to and from an account.

```javascript
const { XRPClient, XRPLNetwork } = require("xpring-js");

const remoteURL = "alpha.test.xrp.xpring.io:50051"; // Testnet URL, use alpha.xrp.xpring.io:50051 for Mainnet
const xrpClient = new XRPClient(remoteURL);
const address = "XVMFQQBMhdouRqhPMuawgBMN1AVFTofPAdRsXG5RkPtUPNQ";
const transactions = await xrpClient.paymentHistory(address);
```

#### Sending XRP

An `XRPClient` can send XRP to other accounts on the XRP Ledger.

**Note:** The payment operation will block the calling thread until the operation reaches a definitive and irreversible success or failure state.

```javascript
const { Wallet, XRPAmount, XRPClient, XRPLNetwork } = require("xpring-js");

const remoteURL = test.xrp.xpring.io:50051; // Testnet URL, use main.xrp.xpring.io:50051 for Mainnet
const xrpClient = new XRPClient(remoteURL, XRPLNetwork.Test);

// Amount of XRP to send
const amount = BigInt("10");

// Destination address.
const destinationAddress = "X7u4MQVhU2YxS4P9fWzQjnNuDRUkP3GM6kiVjTjcQgUU3Jr";

// Wallet which will send XRP
const generationResult = Wallet.generateRandomWallet();
const senderWallet = generationResult.wallet;

const transactionHash = await xrpClient.send(amount, destinationAddress, senderWallet);
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

## Usage: ILP
### IlpClient
`IlpClient` is the main interface into the ILP network.  `IlpClient` must be initialized with the URL of a Hermes instance.
This can be found in your [wallet](https://xpring.io/portal/ilp-wallet).

All calls to `IlpClient` must pass an access token, which can be generated in your [wallet](https://xpring.io/portal/ilp-wallet).

```javascript
const { IlpClient } = require("xpring-js")

const grpcUrl = 'hermes-grpc-test.xpring.dev' // Testnet Hermes URL
const ilpClient = new IlpClient(grpcUrl)
```

#### Retreiving a Balance
An `IlpClient` can check the balance of an account on a connector.

```javascript
const { IlpClient } = require("xpring-js")

const grpcUrl = "hermes-envoy-test.xpring.io" // Testnet Hermes URL
const ilpClient = new IlpClient(grpcUrl)

const balance = await ilpClient.getBalance("demo_user", "2S1PZh3fEKnKg") // Just a demo user on Testnet
console.log("Net balance was " + balance.netBalance + " with asset scale " + balance.assetScale)
```

#### Sending a Payment
An `IlpClient` can send an ILP payment to another ILP address by supplying a [Payment Pointer](https://github.com/interledger/rfcs/blob/master/0026-payment-pointers/0026-payment-pointers.md)
and a sender's account ID

```javascript
const { PaymentRequest, IlpClient } = require("xpring-js")
const bigInt = require("big-integer")

const grpcUrl = "hermes-envoy-test.xpring.io" // Testnet Hermes URL
const ilpClient = new IlpClient(grpcUrl)
const paymentRequest = new PaymentRequest({
    amount: 100,
    destinationPaymentPointer: "$xpring.money/demo_receiver",
    senderAccountId: "demo_user"
  })

PaymentResponse payment = ilpClient.sendPayment(paymentRequest, "2S1PZh3fEKnKg");
```

# Contributing

Pull requests are welcome! To get started with building this library and opening pull requests, please see [contributing.md](CONTRIBUTING.md).

Thank you to all the users who have contributed to this library!

<a href="https://github.com/xpring-eng/xpring-js/graphs/contributors">
  <img src="https://contributors-img.firebaseapp.com/image?repo=xpring-eng/xpring-js" />
</a>

# License

Xpring SDK is available under the MIT license. See the [LICENSE](LICENSE) file for more info.
