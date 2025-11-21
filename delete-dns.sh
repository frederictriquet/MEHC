#!/bin/sh

HOSTNAME_DYNV6="impro.dynv6.net"
# TOKEN_DYNV6=""

if [ "$TOKEN_DYNV6" = "" ]
then
    echo "Error: missing env variable TOKEN_DYNV6" 1>&2
    exit 1
fi

curl -s "https://ipv4.dynv6.com/api/update?hostname=$HOSTNAME_DYNV6&token=$TOKEN_DYNV6&ipv4=-"
curl -s "https://ipv6.dynv6.com/api/update?hostname=$HOSTNAME_DYNV6&token=$TOKEN_DYNV6&ipv6prefix=-"
