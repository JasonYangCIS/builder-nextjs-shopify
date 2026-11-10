#!/bin/sh
set -eu

VERSION="1.5.27"
SHA256="600ebddcb3aaf1fd53653a8d7985df44528722c0f5ee7eb9fff86f26a1a4e5a8"
TMP="$(mktemp)"

curl -fsSL "https://github.com/AikidoSec/safe-chain/releases/download/${VERSION}/install-safe-chain.sh" -o "$TMP"
echo "${SHA256}  ${TMP}" | sha256sum -c -
sh "$TMP" --ci
rm -f "$TMP"
