#!/usr/bin/env bash

set -e -o pipefail

echo "Regenerating Protocol Buffers"

mkdir -p ./generated

# Directory to write generated code to (.js and .d.ts files)
OUT_DIR="./generated"

# Generate node code.
grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:$OUT_DIR \
    --grpc_out=$OUT_DIR \
    --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
     --proto_path=$PWD/terram-protos/proto \
     $PWD/terram-protos/**/*.proto

# Generate tyepscript declaration files.
protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=$OUT_DIR \
    --proto_path=$PWD/terram-protos/proto \
    $PWD/terram-protos/**/*.proto

echo "All done!"
