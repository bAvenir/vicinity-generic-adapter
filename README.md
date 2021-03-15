# bAvenir VICINITY adapter

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/bAvenir/vicinity-generic-adapter?style=plastic)

This is a Node.js project that acts as an adapter between VICINITY and other technologies or applications.
It can be used for a quickstart integration into the VICINITY world, and also can be extended to integrate other technologies, databases or platforms.

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

# TOC

1. <a href="#1"><b>Installing and running</b></a>
2. <a href="#2"><b>Configuration</b></a>
3. <a href="#3"><b>Components</b></a>
4. <a href="#4"><b>Integrations</b></a>
5. <a href="#5"><b>Documentation</b></a>

<hr>

<div id="1"></div>

## 1 - Installing and running 

### Pre-requisites

* GIT
* Node.js > v12 (OPTIONAL - Recommeded in case you want to extend the adapter functionalities)
* Docker
* Docker-compose
* CURL or some other tool for making HTTP requests (i.e. Postman)
* Having a VICINITY account with an access point (For gateway credentials) 
    * Steps 1 and 2 --> https://medium.com/vicinity-h2020/lesson-building-your-first-infrastructure-connected-to-vicinity-279cf0446c6c

### Quick start with an example

In this example we will go through some of the most important steps in VICINITY.

The main purpose is to register a device and a service, and being able to read data.

Other more complex scenarios like the data subscription between different organisations (contracts) are not covered.

The tutorial is intended for MACOS/LINUX however some tips to run in WINDOWS are included. 

In the steps 6-10, inside the *.sh files are included the HTTP requests that will be used, in WINDOWS please run them with your favourite tool.

1. Build bavenir-adapter image for Docker
   * In MACOS/LINUX
        > ./_build_.sh
   * In WINDOWS
        > docker build --tag bavenir-adapter .
2. Move to the folder example_usecase/
    > cd example_usecase/
3. Create a .env file using the example in docs/env-file-example.md
    > cat ../docs/env-file-example.md > .env
4. Update the .env with your gateway credentials ( GTW_ID and GTW_PWD )
    * Add your access point id to GTW_ID
    * Add your access point password to GTW_PWD
    * Update the ADAPTER_PROXY_URL with "http://mockserver:5000/api" or your the address of the service you want to adapt.
    * Update ADAPTER_RESPONSE_MODE="proxy" to enable the proxy mode
5. Run adapter with mockserver
   * In MACOS/LINUX
        > ./start-mock.sh
   * In WINDOWS
        * Create the folders that appear in the file start-mock.sh and then:
        > docker-compose -f 'docker-compose-mock.yml' up
6. Register a property
    > ./requests/register-property.sh 
7. Register a device
    > ./requests/register-device.sh
8. Register a service
    > ./requests/register-service.sh
9. Discover your local infrastructure (What was registered using your gateway credentials)
    > ./requests/local-discovery.sh
    * You should see the object descriptions of your device and service
10. Discover what your service can see
    > ./requests/discover-neighbourhood.sh
    * You should receive an empty array
11. Enable service and device
    * Follow the Step 7 of https://medium.com/vicinity-h2020/lesson-building-your-first-infrastructure-connected-to-vicinity-279cf0446c6c 
12. Rediscover what your service can see
     > ./requests/discover-neighbourhood.sh
    * You should receive an array with the ids of the items visible for your service (With data access)
13. Read your device property using your service
    * You need to provide your service oid, your device oid and your device pid "batteryLevel"
    > ./request/read-property.sh
    * You should receive a message with a value, timestamp and description.
14. Find what else can the Agent API offer:
    * Open http://localhost/docs in any browser to review the adapter API
15. To stop, run ./stop.sh
    > docker-compose -f 'docker-compose-mock.yml' down

### How to run (Developers)

* Development mode
    * First run **npm install** in the project folder
    * ./_setup.sh --> Build and run development mode
    * ./_run.sh --> Run
    * ./_stop.sh --> Stop without destroying docker image

* Production mode
    * ./_setup.sh -e prod --> Build and run production mode
    * ./_run.sh  -e prod --> Run
    * ./_stop.sh --> Stop without destroying docker image
  
* Run development tools
    * npm run test -> for jest tests
    * npm run analyze -> for sonarqube analysis

### Linux deployment notes

* Change path in docker-compose file for volumes
    * Replace ./ for ~/<proj-name>/
* Make sure Gateway folder has full permissions
* Make sure iptables are set to make Docker subnet available
    * Assuming Docker subnet is 172.0.0.0/8 --> iptables -A INPUT -s 172.0.0.0/8 -j ACCEPT

<hr>

<div id="2"></div>

## 2 - Configuration

Use a .env file

Example: Available in docs/env/file-example.md

Load into app using process.env.ENV_VAR and the npm package dotenv.

* ENV_VAR=SOMETHING

* Most of the configuration parameters from the example can be reused for production deployment

* Only GTW_ID and GTW_PWD are **MANDATORY**, it is necessary to have valid VICINITY credentials to run the adapter, the rest of the GATEWAY section can run with default values.

* When using automatic data or events collection, it is necessary to define ADAPTER_SERVICE_OID. It is also recommended to adjust the frequency of properties collection, defined with ADAPTER_TIMER_INTERVAL.

* When using the MQTT module, it is necessary to complete the MQTT configuration section as well as extending the module with information on how to parse the incoming messages.

* SONARQUBE section is not mandatory, add only if you use a sonarqube server for static analysis

<hr>

<div id="3"></div>

## 3 - Adapter Components

### DOCKER

The use of DOCKER is recommended. It is possible to run the Node.js app, VICINITY OGWAPI and REDIS out of DOCKER, however this configuration is not supported. 

* To run without DOCKER:
    * Change the hosts and ports in .env to your convenience
    * Update gateway/GatewayConfig.xml --> < agent >NODEJS-APP-HOST</ agent >
    * Install REDIS
    * Install VICINITY OGWAPI

### AGENT (Core functionality)

Generic adapter builds on bAvenir agent, which is installed as an NPM package.
More information in GitHub:

https://github.com/bAvenir/vicinity-agent


### REDIS

It is used for persisting configuration and caching common requests.

* Decide if caching should be active --> PERSISTANCE_CACHE="enabled" or "disabled"
    * Even with caching disabled REDIS will be used for other purposes, and therefore an instance will be always running
* Decide time to live of cached requests --> PERSISTANCE_CACHE_TTL=60 (in seconds)

A REDIS instance is necessary to run the adapter, however it is possible to configure a connection to a REDIS instance out of DOCKER using:

* PERSISTANCE_DB_HOST="http://my-server" 
* PERSISTANCE_DB_PORT=my-port-number

NOTE: In production, a redis dump is kept in the HOST machine and can be reused to keep the configuration info between restarts, it is possible to add this feature to development by modifying the file docker-compose-dev.yml and adding a volume to the folder ./redis/data. You can modify the frequency with which redis stores the data from memory to the dump file in ./redis/redis.conf. For more information visit REDIS documentation site.

It is also possible to export the in-memory data to files that can afterwards be imported. For more info check the API docs, import/export.

### NGINX

NGINX is used as a reverse proxy to improve performance of Node.js app and to terminate SSL connections. However, it is possible to run the application without it. In order to do so: 

* Remove the proxy instance from docker-compose.yml 
* Change the port of the node js server to 9997
* Change in gateway/GatewayConfig.xml --> < agent >bavenir-adapter</ agent >

#### Using SSL connections to the adapter

* It is possible to activate HTTPS with NGINX.
    1. Get certificates
    2. Use HTTPS configuration in nginx/nginx.conf (Uncomment and edit required sections)
    3. Add in docker-compose.yml volumes with the path of the certificates in the proxy section

<hr>

<div id="4"></div>

## 4 - Integrations

### 4.1 - MQTT

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

### 4.2 - Automatic collection of data

###### Events 

* Subscribe to events:
   1.  by defining which ones you can reach in the file dataurls.json; 
   2.  loading them into the adapter memory, this is automatic and happens everytime the adaper restarts;
   3.  and calling the API endpoint: GET /api/events/subscribe;
   4.  the events will be sent to src/_adapters/interface.js (proxyReceiveEvent)
   5.  You can extend the adapter to do something with the event or use the proxy mode (See below)

###### Properties

* Collect properties:
    1. define which properties you need to collect in the file dataurls.json;
    2. loading them into the adapter memory, this is automatic and happens everytime the adaper restarts;
    3. Start the autocollection: GET /adapter/properties/autorequest
    4. A node JS timer will handle the requests;
    5. the result of the calls will be send to src/_adapters/_classes/propertiesTimer.js, where you can define what to do by extending the funtion _action.

### 4.3 - Integrate your own app or technology

Integrate some software and have it ready to:

* Respond to property requests
* Publish events
* Request properties
* Listen to event channels
* Other actions defined in API specification (See last section) 

#### Using API and proxy

1. Set up proxy mode in configuration: ADAPTER_DATA_COLLECTION_MODE="proxy"
2. Define where your app is listning:  ADAPTER_PROXY_URL="http://192.168.0.1:8000/proxy" (default)
3. Subscribe to events:
   1.  by defining which ones you can reach in the file dataurls.json; 
   2.  loading them into the adapter memory, this is automatic and happens everytime the adaper restarts;
   3.  and calling the API endpoint: GET /api/events/subscribe;
   4.  the events will be sent to your proxy address on the endpoint "POST /event". In the body of the message you will receive {oid: oid, pid: pid, body: body}
4. Your event channels: The adapter will automatically create your event channels based on your registered devices. In order to publish a message use: PUT /api/events/local/{id}/{eid}
5. To request a property of some remote device use the endpoint: GET /api/properties/{id}/{oid}/{pid} (or PUT to update property)
6. If someone requests one of your exposed properties, the message will be redirected to your proxy address on the endpoint "POST /get", "POST /put" for updating a property. In the body of the message you will receive {oid: oid, pid: pid, body: body}
7. Follow the API specification to see what other things can be done. (See last section)

See API specification for more info about how to use each endpoint.

#### Extend the adapter

You can make use of the Agent functions and a custom defined data model "mappers" to build extensions. The recommendation is to use this generic Adapter as development platform.

See the documentation of the Agent for info about the available resources: https://github.com/bAvenir/vicinity-agent

See docs/documentation.md for info on mappers model.

<hr>

<div id="5"></div>

## 5 - Additional Documentation

* The folder docs/ contains helpful resources to create registrations and interaction files.
    * documentation.md: Shows how to perform some basic tasks and how to load files into the adapter memory.
    * registrations.md: How to register/unregister
    * properties.md, actions.md, events.md: Examples of how to define interacion patterns.
* The endpoint localhost/docs displays the API specification for the agent & adapter.