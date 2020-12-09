# Pull Submodules
git submodule update --init --recursive

# Install dependencies
npm i
brew update
brew tap adoptopenjdk/openjdk
brew cask install adoptopenjdk11
brew install protobuf
