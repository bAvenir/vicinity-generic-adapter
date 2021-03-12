#!/bin/bash
USAGE="$(basename "$0") [-h -e]
-- Prepares prod or dev mode
-- Deletes old images
-- Examples
./_setup.sh 
Where:
  Flags:
      -h  Shows help
      -e  environment [dev, prod]"

# Default config
MY_ENV="dev"
MY_PATH=$(pwd)

# Get configuration
while getopts 'hd:e:' OPTION; do
case "$OPTION" in
    h)
    echo "$USAGE"
    exit 0
    ;;
    e)
    MY_ENV="$OPTARG"
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

# Kill and remove old proxy containers
docker kill proxy bavenir-adapter gateway cache-db
docker rm proxy bavenir-adapter gateway cache-db
docker rmi bavenir-adapter_bavenir-adapter
docker rm $(docker ps -a -q) # Remove zombi containers

docker-compose up