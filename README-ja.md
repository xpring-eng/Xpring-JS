[![CircleCI](https://img.shields.io/circleci/build/github/xpring-eng/Xpring-JS?style=flat-square)](https://circleci.com/gh/xpring-eng/xpring-js/tree/master)
[![CodeCov](https://img.shields.io/codecov/c/github/xpring-eng/xpring-js?style=flat-square)]((https://codecov.io/gh/xpring-eng/xpring-js))
[![Dependabot Status](https://img.shields.io/static/v1?label=Dependabot&message=enabled&color=success&style=flat-square&logo=dependabot)](https://dependabot.com)

# Xpring-JS

Xpring-JSは、Xpring SDKのJavaScriptクライアント側ライブラリです。

## 機能
Xpring-JSは次の機能を提供します:
- ウォレットの生成と派生（シードベースまたはHDウォレットベース）
- アドレス検証
- 口座残高の取得
- XRP支払いの送信

## インストレーション

Xpring-JSは、2つのコンポーネントを使用してXpringプラットフォームにアクセスします。
1) Xpring-JSクライアント側ライブラリ（このライブラリ）
2) このライブラリからのリクエストを処理し、XRPノードにプロキシするサーバー側コンポーネント

### クライアント側ライブラリ
Xpring-JSはNPMパッケージとして利用できます。次のようにインストールしてください：

```shell
$ npm i xpring-js
```

### サーバー側コンポーネント
サーバー側コンポーネントは、クライアント側のリクエストをXRPノードに送信します。

開発者がすぐに開発を開始できるように, Xpringは現在、サーバー側コンポーネントをホスト型サービスとして提供し、クライアント側ライブラリからのリクエストをXRPノードにプロキシします。開発者は次のエンドポイントに到達できます:
```
# TestNet - Node
alpha.test.xrp.xpring.io:50051

# MainNet - Node
alpha.xrp.xpring.io:50051

#TestNet - Browser
https://envoy.test.xrp.xpring.io

#MainNet - Browser
https://envoy.xrp.xpring.io
```

Xpringは、XRPノードユーザーが[rippled](https://github.com/ripple/rippled)のオープンソースコンポーネントとしてアダプターを展開および使用するためのゼロコンフィグの方法の構築に取り組んでいます。乞うご期待！

## 使用方法

**注意:** Xpring SDKはX-Addressフォーマットでのみ動作します。このフォーマットの詳細については、[Utilities section]（＃utilities）および<http://xrpaddress.info>を参照してください。

### ウォレット
ウォレットは、鍵の管理、アドレスの導出、および署名機能を提供するXpringKitの基本的なモデルオブジェクトです。 ウォレットは、シードまたはニーモニック、および導出パスから導出できます。新しいランダムHDウォレットを生成することもできます。

#### ウォレットの導出
Xpring-JSは、シードからウォレットを導出させるか、ニーモニックおよび導出パスから階層的な決定性ウォレット（HDWallet）を導出させることができます。

##### 階層的決定性ウォレット
ニーモニックと導出パスを使用して、階層的な決定性ウォレットが作成されます。ニーモニックと導出パスをウォレット生成関数に渡すだけです。導出パスを省略し、代わりにデフォルトのパスを使用できることにも注目です。

```javascript
const { Wallet } = require("xpring-js");

const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

const hdWallet1 = Wallet.generateWalletFromMnemonic(mnemonic); // Has default derivation path
const hdWallet2 = Wallet.generateWalletFromMnemonic(mnemonic, Wallet.getDefaultDerivationPath()); // Same as hdWallet1

const hdWallet = Wallet.generateWalletFromMnemonic(mnemonic, "m/44'/144'/0'/0/1"); // Wallet with custom derivation path.
```

##### シードベースのウォレット
base58checkでエンコードされたシード文字列を渡すことで、シードベースのウォレットを構築できます。
```javascript
const { Wallet } = require("xpring-js");

const seedWallet = Wallet.generateWalletFromSeed("snRiAJGeKCkPVddbjB3zRwiYDBm1M");
```

#### ウォレットの生成
Xpring-JSは、新しいランダムなHD Walletを生成できます。ウォレット生成の呼び出しの結果は、次を含むタプルです:
- ランダムに生成されたニーモニック
- 使用された導出パス、これはデフォルトのパスです
- 新しいウォレットへの参照

```javascript
const { Wallet } = require("xpring-js");

// Generate a random wallet.
const generationResult = Wallet.generateRandomWallet();
const newWallet = generationResult.wallet

// Wallet can be recreated with the artifacts of the initial generation.
const copyOfNewWallet = Wallet.generateWalletFromMnemonic(generationResult.mnemonic, generationResult.derivationPath)
```

#### ウォレットのプロパティ
生成されたウォレットは、XRPレジャー上で公開鍵、秘密鍵、およびアドレスを提供できます。

```javascript
const { Wallet } = require("xpring-js");

const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

const wallet = Wallet.generateWalletFromMnemonic(mnemonic);

console.log(wallet.getAddress()); // XVMFQQBMhdouRqhPMuawgBMN1AVFTofPAdRsXG5RkPtUPNQ
console.log(wallet.getPublicKey()); // 031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE
console.log(wallet.getPrivateKey()); // 0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4
```

#### 署名/検証

ウォレットは、任意の16進数のメッセージに署名して検証することもできます。一般的に、ユーザーはこれらの低レベルAPIは使用せずに、 `XRPClient`上の暗号化機能を実行しなければなりません。

```javascript
const { Wallet } = require("xpringkit-js");

const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const message = "deadbeef";

const wallet = Wallet.generateWalletFromMnemonic(mnemonic);

const signature = wallet.sign(message);
wallet.verify(message, signature); // true
```

### XRPClient

「XRPClient」はXRPレジャーへのゲートウェイです。 「XRPClient」は、リモートアダプターのURLである単一のパラメーターで初期化されます（上記の「サーバー側コンポーネント」セクションを参照）。

```javascript
const { XRPClient } = require("xpring-js");

const remoteURL = alpha.test.xrp.xpring.io:50051; // TestNet URL, use alpha.xrp.xpring.io:50051 for MainNet
const xpringClient = new XpringClient(remoteURL, true)
```

#### 口座残高の取得

「XRPClient」は、レジャーのアカウントの残高を確認できます。

```javascript
const { XRPClient } = require("xpring-js");

const remoteURL = alpha.test.xrp.xpring.io:50051; // TestNet URL, use alpha.xrp.xpring.io:50051 for MainNet
const xpringClient = new XpringClient(remoteURL, true);

const address = "X7u4MQVhU2YxS4P9fWzQjnNuDRUkP3GM6kiVjTjcQgUU3Jr";

const balance = await xrpClient.getBalance(address);
console.log(balance); // Logs a balance in drops of XRP
```

#### XRPの送信

「XRPClient」は、レジャー上の他のアカウント宛にXRPを送信できます。

```javascript
const { Wallet, XRPAmount, XRPClient } = require("xpring-js");

const remoteURL = "alpha.test.xrp.xpring.io:50051"; // TestNet URL, use alpha.xrp.xpring.io:50051 for MainNet
const xpringClient = new XpringClient(remoteURL, true)

// Amount of XRP to send
const amount = BigInt("10")

// Destination address.
const destinationAddress = "X7u4MQVhU2YxS4P9fWzQjnNuDRUkP3GM6kiVjTjcQgUU3Jr";

// Wallet which will send XRP
const generationResult = Wallet.generateRandomWallet();
const senderWallet = generationResult.wallet;

const transactionHash = await xrpClient.send(amount, destinationAddress, senderWallet);
```

### ユーティリティー
#### アドレスの検証

Utils オブジェクトはアドレス検証のための簡単な方法を提供します。

```javascript
const { Utils } = require("xpring-js")

const rippleClassicAddress = "rnysDDrRXxz9z66DmCmfWpq4Z5s4TyUP3G"
const rippleXAddress = "X7jjQ4d6bz1qmjwxYUsw6gtxSyjYv5iWPqPEjGqqhn9Woti";
const bitcoinAddress = "1DiqLtKZZviDxccRpowkhVowsbLSNQWBE8";

Utils.isValidAddress(rippleClassicAddress); // returns true
Utils.isValidAddress(rippleXAddress); // returns true
Utils.isValidAddress(bitcoinAddress); // returns false
```

また、アドレスがX-Addressなのかクラシックアドレスなのかを検証することもできます。
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

### X-Address エンコード

SDKを使用してX-Addressをエンコードおよびデコードできます。

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

# コントリビューティング

プルリクエストは大歓迎です！このライブラリを構築し、プルリクエストをオープンにしていく際には、[contributing.md](https://github.com/xpring-eng/Xpring-JS/blob/master/CONTRIBUTING.md)を参照してください。

このライブラリに貢献していただいているすべてのユーザーに感謝します！

<a href="https://github.com/xpring-eng/xpring-js/graphs/contributors">
  <img src="https://contributors-img.firebaseapp.com/image?repo=xpring-eng/xpring-js" />
</a>

# ライセンス

Xpring SDKはMITライセンスの下で利用可能です。詳細については 、[LICENSE](https://github.com/xpring-eng/Xpring-JS/blob/master/LICENSE)ファイルを参照してください。
