const MQTT = require('../../_classes/mqtt');
const Log = require('../../_classes/logger');
const config = require('../configuration');
const gateway = require('../../_agent/interface');
const persistance = require('../../_persistance/interface');

// Declare global objects
let client =  new MQTT(config.mqtt.host, config.mqtt.user, config.mqtt.password);
let logger =  new Log();
let functions = {};

// Available actions on MQTT client

/**
 * Connects to the MQTT server
 * - Looks in registered items for OIDs and names
 * - Checks if there are topics in mqtt.json file to be subscribed
 * - Waits for events
 */
functions.connect = async function(){
    if(_validateMqttConfig()){
        try{
            let mqttListener = await client.connect();
            await _initializeMqttItems(); 
            await _initializeMqttTopics();
            // Listeners
                mqttListener.on('connect', () => { logger.info('Connected to MQTT server', 'MQTT'); } );
                mqttListener.on('error', (error) => { logger.error(error , 'MQTT'); } );
                mqttListener.on('end', () => { logger.info('User successfully disconnected from MQTT server', 'MQTT'); } );
                mqttListener.on('close', () => { logger.warn('Broker closed connection', 'MQTT'); } );
                mqttListener.on('disconnect', () => { logger.warn('Broker closed connection', 'MQTT'); } );
                mqttListener.on('message', function(topic, message, packet) {
                    logger.info("Received " + message + " on " + topic, "MQTT");
                    _processIncomingMessage(JSON.parse(message), topic);
                });
        } catch(err) {
            logger.error(err, 'MQTT');
            client.disconnect();
            throw new Error('Connect failed...');
        }
    }
}

/**
 * Disconnect MQTT server
 */
functions.disconnect = function(){
    try{
        client.disconnect();
    } catch(err) {
        logger.error(err, 'MQTT');
        throw new Error('Disconnect failed...');
    }
}

/**
 * Subscribe a MQTT topic
 * @param {Object} data { topic: String, event: String }
 */
functions.subscribe = function(data){
    try{
        client.subscribe(data);
    } catch(err) {
        logger.error(err, 'MQTT');
        throw new Error('Subscribe failed...');
    }
}

/**
 * Unsubscribe MQTT topic
 * @param {String} topic
 */
functions.unsubscribe = function(data){
    try{
        client.unsubscribe(data.topic);
    } catch(err) {
        logger.error(err, 'MQTT');
        throw new Error('Unsubscribe failed...');
    }
}

// Make available public methods
module.exports = functions;

// Private functions

/**
 * Check if all the configuration required for running MQTT is available
 * Configuration located in .env
 */
 function _validateMqttConfig(){
    let flag = true;
    if(!config.mqtt.host) flag = false ;
    if(!config.mqtt.user) flag = false;
    if(!config.mqtt.password) flag = false;
    if(!config.mqtt.infrastructureName) flag = false;
    if(!config.mqtt.itemsType) flag = false;
    if(!config.mqtt.itemsEvents) flag = false;
    if(!flag) logger.error('Missing mqtt configuration parameters', 'MQTT');
    return flag;
}

/**
 * Process incoming MQTT messages
 * This function should be modified to fit the needs of each MQTT server
 * - Sends the MQTT message as VICINITY event
 * - Registers new MQTT items sending 
 * @param {String} message 
 * @param {String} topic 
 */
async function _processIncomingMessage(message, topic){
    logger.debug('We do nothing with the mqtt message, please define some actions...', 'MQTT');
    // try{
    //     let mqttItems = client.mqttItems;
    //     // Obtain mqttItem name of sender
    //     let topicParts = topic.split('/');
    //     let name = topicParts[2];
    //     logger.debug(name, 'DEBUG');
    //     // Get OID of MQTT item or null
    //     let oid = mqttItems[name];
    //     logger.debug(oid, 'DEBUG');
    //     // If OID exists --> Send message
    //     if(oid){
    //         // Prepare message for sending
    //         // Obtain VICNITY eid from topic
    //         // Send event
    //         let topics = client.mqttTopics;
    //         topicParts[2] = '+';
    //         topic = topicParts.toString();
    //         let match = topics.filter((it)=>{ return it.topic === topic; });
    //         if(match){
    //             _sendEvent(oid, match.event, message);
    //         } else {
    //             logger.debug('Topic ' + topic + ' does not have a matching event...');
    //         }
    //     } else {
    //         // Prepare body for registration
    //         // BUILD BODY with .env info about MQTT
    //         // Request registration
    //         _registerItem(_buildBody(name));
    //     }
    // } catch(err) {
    //     logger.error(err, 'MQTT');
    // }
}

/**
 * Gets unregistered MQTT item and sends request to VICINITY
 */
async function _registerItem(body){
//     try{
//          await gateway.postRegistrations(body)
//     } catch(err) {
//         logger.error(err, 'MQTT');
//     }
}

/**
 * Publishes a VICINITY event
 * Last step of converting MQTT message into VICINITY event
 * @param {String} oid 
 * @param {String} eid 
 * @param {Object} body 
 */
async function _sendEvent(oid, eid, body){
//     try{
//         await gateway.publishEvent(oid, eid, body);
//     } catch(err) {
//         logger.error(err, 'MQTT');
//     }
}

/**
 * Loads file with topics
 * file --> ./agent/import/mqtt.json
 * contains --> array of objects mapping MQTT topic with VICINITY event
 * [{topic: "", event: ""}]
 */
async function _initializeMqttTopics(){
    try{
        let data = await persistance.loadConfigurationFile('mqtt');
        for(let i=0,l=data.length; i<l; i++){
            client.subscribe(data[i]);
        }
        logger.info('MQTT topics loaded and subscribed', 'MQTT');
    } catch(err) {
        logger.error(err, 'MQTT');
        return Promise.resolve(false);
    }
}

/**
 * Loads already registered mqtt items 
 */
async function _initializeMqttItems(){
    try{
        let items = await persistance.getLocalObjects();
        let aux, newItem = {};
        for(let i=0,l=items.length; i<l; i++){
            aux = await persistance.getLocalObjects(items[i]);
            newItem = {name: aux.name, "oid": items[i]};
            client.mqttItems = newItem;
        }
        logger.info('MQTT items loaded', 'MQTT');
    } catch(err) {
        return Promise.reject(err);
    }
}

/**
 * Prepares information for registration
 */
function _buildBody(name){
    return {
        name: config.mqtt.infrastructureName + "_" + name,
        adapterId: name,
        type: config.mqtt.itemsType,
        events: config.mqtt.itemsEvents
    }
}