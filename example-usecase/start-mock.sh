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

docker-compose -f 'docker-compose-mock.yml' up