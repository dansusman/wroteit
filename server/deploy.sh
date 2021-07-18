#!/bin/bash

echo What should the version of this build be?

read VERSION

docker build -t susmand/wroteit:$VERSION .
docker push susmand/wroteit:$VERSION

ssh root@143.198.180.169 "docker pull susmand/wroteit:$VERSION && docker tag susmand/wroteit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"