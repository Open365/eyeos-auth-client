#!/bin/sh

set -e
set -u
set -x

if [ ! -f /.dockerinit ]; then
	npm install
	bower install
fi


grunt build-client

echo "Currently at $PWD"
mkdir pkgs
tar -czvf pkgs/eyeosAuthClientArtifact.tar.gz ./build/ bower.json
