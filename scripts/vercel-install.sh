#!/bin/sh
set -eu

sh scripts/install-safe-chain.sh

export PATH="$HOME/.safe-chain/shims:$HOME/.safe-chain/bin:$PATH"
export SAFE_CHAIN_LOGGING=normal
export SAFE_CHAIN_NPM_CUSTOM_REGISTRIES=npm.pkg.github.com
export SAFE_CHAIN_MINIMUM_PACKAGE_AGE_EXCLUSIONS='@jasonyangcis/*,@builder.io/*'

npm ci
