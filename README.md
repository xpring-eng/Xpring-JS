[![CircleCI](https://img.shields.io/circleci/build/github/xpring-eng/Xpring-JS/master?style=flat&token=8f614950de4d2dc800bb51710667bbd90d82dda3)](https://circleci.com/gh/xpring-eng/Xpring-JS)
[![Coverage](https://coveralls.io/repos/github/xpring-eng/Xpring-JS/badge.svg?t=DkDKCV)](https://coveralls.io/github/xpring-eng/Xpring-JS)

# XRP-JS
XRP JS provides a Javascript based SDK for interacting with the Ripple Ledger.

# Setup

These instructions assume you are using OSX. 


```shell
# Install Homebrew
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# Clone repo
$ git clone https://github.com/xpring-eng/xpring-js.git
$ cd xpring-js

# Pull submodules
$ git submodule init
$ git submodule update --remote

# Install Protocol Buffers
$ brew install protobuf

# Install GRPC
$ brew tap grpc/grpc
$ brew install grpc

# Install required modules.
$ npm i 

# Run tests
$ npm test
```

# Dependencies:
* AppianJS: Javascript based networking interface (_coming soon_)
* [Terram(JS)](https://github.com/xpring-eng/terram): Core Ripple SDK functionality implemented in JS.
* [Terram-Protos](https://github.com/xpring-eng/terram-protos): Common protobuf objects used across Ripple's SDK Libraries.
