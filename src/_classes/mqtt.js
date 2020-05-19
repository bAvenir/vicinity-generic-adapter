/**
 * mqtt.js
 * Supports connections to mqtt servers
 * @class
 */

let mqtt_package = require("mqtt");

 module.exports = class MQTT{

    constructor(host, username, password) {
        this.options = {};
        this.options.host = host;
        this.options.clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
        this.options.username = username;
        this.options.password = password;
        this.options.keepalive = 60;
        this.options.reconnectPeriod = 1000;
        this.options.protocolId = 'MQIsdp';
        this.options.protocolVersion = 3;
        this.options.clean = true;
        this.options.encoding = 'utf8';
    }

    connect(){
        return new Promise((resolve, reject) => {
            try{
                this.client = mqtt_package.connect(this.options.host, this.options);
                resolve(this.client);
            } catch(err) {
                reject(err);
            }
        });   
    }

    disconnect(){
        this.client.end();
    }

    subscribe(topic){
        this.client.subscribe(topic);
    }

    unsubscribe(topic){
        this.client.unsubscribe(topic);
    }

}