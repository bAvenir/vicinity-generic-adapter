#!/bin/bash
USAGE="$(basename "$0") [-h]
-- Examples
./start.sh 
Where:
  Flags:
      -h  Shows help"

# Default config
MY_PATH=$(pwd)

# Get configuration
while getopts 'hd:' OPTION; do
case "$OPTION" in
    h)
    echo "$USAGE"
    exit 0
    ;;
esac
done

# Initial folder setup
mkdir -p ${MY_PATH}/gateway/log
mkdir -p ${MY_PATH}/agent/exports
mkdir -p ${MY_PATH}/agent/imports
mkdir -p ${MY_PATH}/nginx/logs
mkdir -p ${MY_PATH}/redis/data
mkdir -p ${MY_PATH}/log

# Make gateway folders accessible to docker
chmod 777 -R ${MY_PATH}/gateway

docker rm $(docker ps -a -q) # Remove zombi containers

docker-compose up -d