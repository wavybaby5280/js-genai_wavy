#!/usr/bin/env bash

set -ex

npm run build-prod
TARBALL="$(npm pack)"

cd samples
npm install "../${TARBALL}"
npm run build
