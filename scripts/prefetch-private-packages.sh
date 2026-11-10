#!/bin/sh
set -eu

node -e '
const lock = require("./package-lock.json");
for (const [k, v] of Object.entries(lock.packages || {})) {
  if (k.includes("node_modules/@jasonyangcis/") && v.resolved) console.log(v.resolved);
}
' | while read -r url; do
  npm cache add "$url"
done
