#!/usr/bin/env bash

set -e -o pipefail

echo "Regenerating Protocol Buffers"

mkdir -p ./generated

# Path to this plugin 
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"
 
# Directory to write generated code to (.js and .d.ts files) 
OUT_DIR="./generated"
 
protoc \
    --proto_path=$PWD/terram-protos/models \
    --proto_path=$PWD/terram-protos/services \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="service=true:${OUT_DIR}" \
    $PWD/terram-protos/**/*.proto

echo "All done!"
