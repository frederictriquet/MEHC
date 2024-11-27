#!/bin/sh

HOSTNAME_DYNV6="impro.dynv6.net"
# TOKEN_DYNV6=""
DEVICE_INTERFACE=eth0

IP4ADDR=$(ifconfig $DEVICE_INTERFACE | grep 'inet ' | awk '{print $2}')
IP6ADDR=$(ifconfig $DEVICE_INTERFACE | grep 'inet6 ' | awk '{print $2}')
# echo $IP4ADDR
# echo $IP6ADDR

if [ "$TOKEN_DYNV6" = "" ]
then
    echo "Error: missing env variable TOKEN_DYNV6" 1>&2
    exit 1
fi

if [ "$IP4ADDR" = "" ]
then
        echo "Error: unable to determine IPv4 address" 1>&2
fi

if [ "$IP6ADDR" = "" ]
then
        echo "Error: unable to determine IPv6 address" 1>&2
fi

if [ "$IP4ADDR" != "" ]
then
	ping $HOSTNAME_DYNV6 -4 -c 1 > null # a little dirty - needed to update dns-cache
	IP4ADDR_DYNV6=$(dig $HOSTNAME_DYNV6 A +short)

	if [ "$IP4ADDR" != "$IP4ADDR_DYNV6" ]
	then
		echo "IPv4 adress has changed ($IP4ADDR_DYNV6 --> $IP4ADDR)"
		curl -s "https://ipv4.dynv6.com/api/update?hostname=$HOSTNAME_DYNV6&token=$TOKEN_DYNV6&ipv4=auto"
    else
        echo "IPv4 address has not changed ($IP4ADDR)"
	fi
fi

if [ "$IP6ADDR" != "" ]
then
        ping $HOSTNAME_DYNV6 -6 -c 1 > null # a little dirty - needed to update dns-cache
		IP6ADDR_DYNV6=$(dig $HOSTNAME_DYNV6 AAAA +short)

	if [ "$IP6ADDR" != "$IP6ADDR_DYNV6" ]
	then
		echo "IPv6 adress has changed ($IP6ADDR_DYNV6 --> $IP6ADDR)"
		curl -s "https://ipv6.dynv6.com/api/update?hostname=$HOSTNAME_DYNV6&token=$TOKEN_DYNV6&ipv6prefix=$IP6ADDR_WITH_MASK"
    else
        echo "IPv6 address has not changed ($IP6ADDR)"
	fi
fi