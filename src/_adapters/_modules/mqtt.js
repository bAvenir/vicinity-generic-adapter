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

functions.connect = async function(){
    if(_validateMqttConfig()){
        try{
            let mqttListener = await client.connect();
            // _subscribeTopics();
            // Listeners
                mqttListener.on('connect', () => { logger.info('Connected to MQTT server', 'MQTT'); } );
                mqttListener.on('error', (error) => { logger.error(error , 'MQTT'); } );
                mqttListener.on('end', () => { logger.info('User successfully disconnected from MQTT server', 'MQTT'); } );
                mqttListener.on('close', () => { logger.warn('Broker closed connection', 'MQTT'); } );
                mqttListener.on('disconnect', () => { logger.warn('Broker closed connection', 'MQTT'); } );
                mqttListener.on('message', function(topic, message, packet) {
                    logger.info("Received " + message + " on " + topic, "MQTT");
                    // _processEvent(JSON.parse(message), topic);
                });
        } catch(err) {
            logger.error(err, 'MQTT');
            throw new Error('Connect failed...');
        }
    }
}

functions.disconnect = function(){
    try{
        client.disconnect();
    } catch(err) {
        logger.error(err, 'MQTT');
        throw new Error('Disconnect failed...');
    }
}

functions.subscribe = function(topic){
    try{
        client.subscribe(topic);
    } catch(err) {
        logger.error(err, 'MQTT');
        throw new Error('Subscribe failed...');
    }
}

functions.unsubscribe = function(topic){
    try{
        client.unsubscribe(topic);
    } catch(err) {
        logger.error(err, 'MQTT');
        throw new Error('Unsubscribe failed...');
    }
}

// Make available public methods
module.exports = functions;

// Private functions

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

function _processEvent(){}

function _registerItem(){}

function _subscribeTopics(){}
