/**
 * ADAPTER configuration parameters
 * Included in .env (at project root)
 */

const dotenv = require('dotenv');

// Read configuration      
dotenv.config();

// Configuration object to export
let config = module.exports = {};

// Argument passed to node when starting app
config.rootPath = process.env.NODE_PATH || ".";
config.responseMode = process.env.ADAPTER_RESPONSE_MODE || "dummy";
config.dataCollectionMode = process.env.ADAPTER_DATA_COLLECTION_MODE || "dummy";
config.proxyUrl = process.env.ADAPTER_PROXY_URL || "http://localhost:8000";
config.serviceOid = process.env.ADAPTER_SERVICE_OID || null;
config.mqtt = {};
config.mqtt.host = process.env.ADAPTER_MQTT_HOST || null;
config.mqtt.user = process.env.ADAPTER_MQTT_USER || null;
config.mqtt.password = process.env.ADAPTER_MQTT_PASSWORD || null;
config.mqtt.infrastructureName = process.env.ADAPTER_MQTT_INFRASTRUCTURE_NAME|| null;
config.mqtt.itemsType = process.env.ADAPTER_MQTT_ITEMS_TYPE || null;
config.mqtt.itemsEvents = process.env.ADAPTER_MQTT_ITEMS_EVENTS.split(',') || "";
