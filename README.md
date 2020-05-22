# bAvenir VICINITY adapter

**Current version V.1**

This is a Node.js project that acts as an adapter between VICINITY and other technologies or applications.

The first version aims to support the following interactions:

* Suport Data collection and integration with 3rd party apps
* Support to GATEWAY REST
* Support to GATEWAY EVENTS
* Management of registrations and credentials
* Support for creating Thing Descriptions
* MQTT module to help develop adapter for this technology
* Atomatic collection of properties using NodeJS timers

### Future versions

* Add support to GATEWAY actions
* Add generic adapters/support for known technologies

## Pre-requisites

* Node.js > v12
* Docker
* Docker-compose

## How to run

* Development mode
    * First run **npm install** in the project folder
    * ./_setup.sh --> Build and run development mode
    * ./_run.sh --> Run
    * ./_stop.sh --> Stop without destroying docker image

* Production mode
    * ./_setup.sh -e prod --> Build and run production mode
    * ./_run.sh --> Run
    * ./_stop.sh --> Stop without destroying docker image
  
* Run development tools
    * npm run test -> for jest tests
    * npm run analyze -> for sonarqube analysis 

## Linux deployment notes

* Change path in docker-compose file for volumes
    * Replace ./ for ~/<proj-name>/
* Make sure Gateway folder has full permissions
* Make sure iptables are set to make Docker subnet available

## Configuration

Use a .env file

* ENV_VAR=SOMETHING

* Most of the configuration parameters from the example can be reused for production deployment

* Only GTW_ID and GTW_PWD are **MANDATORY**, it is necessary to have valid VICINITY credentials to run the adapter

* When using automatic data or events collection, it is necessary to define ADAPTER_SERVICE_OID.

* When using the MQTT module, it is necessary to complete the MQTT configuration section as well as extending the module with information on how to parse the incoming messages.

* SONARQUBE section is not mandatory, add only if you use a sonarqube server for static analysis

Example:

    # Configuration
    #### Environments ["development", "production"]
    NODE_ENV=production
    ## SERVER
    SERVER_PORT=3000
    SERVER_IP=0.0.0.0
    SERVER_TIMEOUT=10000
    SERVER_MAX_PAYLOAD=100kb
    ## GATEWAY
    GTW_HOST="gateway"
    GTW_PORT=8181
    GTW_CALLBACK_ROUTE=agent
    GTW_ROUTE=api
    GTW_TIMEOUT=10000
    #### Add your credentials below, obtain them in the Neighbourhood Manager
    GTW_ID=""
    GTW_PWD=""
    ## ADAPTER
    #### OID used for collecting data credentials
    ADAPTER_SERVICE_OID=""
    #### Response Modes ["dummy", "proxy"]
    ADAPTER_RESPONSE_MODE="dummy"
    #### Collection Modes ["dummy", "proxy"]
    ADAPTER_DATA_COLLECTION_MODE="dummy"
    ADAPTER_PROXY_URL="http://192.168.0.1:8000/proxy"
    #### Default timer interval 15min = 90000sec
    ADAPTER_TIMER_INTERVAL=90000
    #### ADAPTER MQTT
    ADAPTER_MQTT_HOST="host"
    ADAPTER_MQTT_USER="user"
    ADAPTER_MQTT_PASSWORD="password"
    ADAPTER_MQTT_INFRASTRUCTURE_NAME="MQTTTEST"
    ADAPTER_MQTT_ITEMS_TYPE="core:Device"
    ADAPTER_MQTT_ITEMS_EVENTS="test"
    ## Persistance
    PERSISTANCE_DB="redis"
    PERSISTANCE_DB_HOST="cache-db"
    PERSISTANCE_DB_PORT=6379
    PERSISTANCE_CACHE="enabled"
    PERSISTANCE_CACHE_TTL=60
    ## Sonar-scanner
    SONAR_URL=http://localhost:9000
    SONAR_TOKEN=<ADD_YOUR_TOKEN>
    SONAR_PROJECT_NAME=<ADD_YOUR_PROJECT_NAME>
    SONAR_SOURCES=src
    SONAR_INCLUSIONS=**
    SONAR_TESTS=src/_test
    SONAR_TEST_FILE_PATH=./coverage/test-reporter.xml
    SONAR_COVERAGE_FILE_PATH=./coverage/lcov.info

Load into app using process.env.ENV_VAR and the npm package dotenv.

## DOCKER

The use of DOCKER is recommended. It is possible to run the Node.js app, VICINITY OGWAPI and REDIS out of DOCKER, however this configuration is not supported. 

* To run without DOCKER:
    * Change the hosts and ports in .env to your convenience
    * Update gateway/GatewayConfig.xml --> < agent >NODEJS-APP-HOST</ agent >
    * Install REDIS
    * Install VICINITY OGWAPI

## REDIS

It is used for persisting configuration and caching common requests.

* Decide if caching should be active --> PERSISTANCE_CACHE="enabled" or "disabled"
    * Even with caching disabled REDIS will be used for other purposes, and therefore an instance will be always running
* Decide time to live of cached requests --> PERSISTANCE_CACHE_TTL=60 (in seconds)

A REDIS instance is necessary to run the adapter, however it is possible to configure a connection to a REDIS instance out of DOCKER using:

* PERSISTANCE_DB_HOST="http://my-server" 
* PERSISTANCE_DB_PORT=my-port-number

NOTE: In production, a redis dump is kept in the HOST machine and can be reused to keep the configuration info between restarts, it is possible to add this feature to development by modifying the file docker-compose-dev.yml and adding a volume to the folder ./redis/data. You can modify the frequency with which redis stores the data from memory to the dump file in ./redis/redis.conf. For more information visit REDIS documentation site.

It is also possible to export the in-memory data to files that can afterwards be imported. For more info check the API docs, import/export.

## NGINX

NGINX is used as a reverse proxy to improve performance of Node.js app and to terminate SSL connections. However, it is possible to run the application without it. In order to do so: 

* Remove the proxy instance from docker-compose.yml 
* Change the port of the node js server to 9997
* Change in gateway/GatewayConfig.xml --> < agent >bavenir-adapter</ agent >

#### Using SSL connections to the adapter

* It is possible to activate HTTPS with NGINX.
    1. Get certificates
    2. Use HTTPS configuration in nginx/nginx.conf (Uncomment and edit required sections)
    3. Add in docker-compose.yml volumes with the path of the certificates in the proxy section

## MQTT

The adapter supports the integration of MQTT data leveraging the NodeJS MQTT package. The connection, disconnection, subscription and unsubscription of channels will be handled by the adapter.

The developer using the adapter will need to extend the MQTT module (./src/_adapters/_modules/mqtt.js), concretely the function _processIncomingMessage(), _findMatching() and _parseMsg(). The task will be to parse the incoming messages based on their structure and use the prebuilt functions _sendEvent() and _registerItem() to publish the result as a VICINITY event or to register the item generating the messages if it was new.

#### MQTT mapper file

Under ./agent/imports a file with a mapping between mqtt topics and VICINITY events should be placed. This file will contain an array with the following structure:

    [{ "event": "vicinity_event_defined_by_user", "topic": "mqtt_topic_with_wildcards_when_necessary"}]

#### MQTT configuration variables

* ADAPTER_MQTT_HOST -> Host of the MQTT service
* ADAPTER_MQTT_USER -> User
* ADAPTER_MQTT_PASSWORD -> Password
* ADAPTER_MQTT_INFRASTRUCTURE_NAME -> Prefix to add to all your mqtt items to help identification
* ADAPTER_MQTT_ITEMS_TYPE -> VICINITY item type of your your infrastructure objects emmiting the messages
* ADAPTER_MQTT_ITEMS_EVENTS -> VICINITY event name defined by user, accepts many separated by commas, depends on how many topics you need to map

## Documentation

* The folder docs contains helpful resources to register and create interactions.
* The endpoint localhost/docs displays the API specification.

## Includes

* Management of VICINITY OGWAPI lifecycle
* Reverse Proxy NGINX
* DOCKER configuration
* Persistance and caching REDIS
* MQTT module
* Module for automatic collection of data using NodeJS timers
* Built-in CI with DOCKER
* Testing
* Security features 
* Sonarqube scanner