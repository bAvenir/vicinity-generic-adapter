    # Configuration
    #### Environments ["development", "production"]
    NODE_ENV=production
    ## SERVER
    SERVER_PORT=3000
    SERVER_IP=0.0.0.0
    SERVER_TIMEOUT=10000
    SERVER_MAX_PAYLOAD=100kb
    ## GATEWAY
    #### Replace GTW_HOST by localhost if local mode
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
    #### Replace PERSISTANCE_DB_HOST by localhost if local mode
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