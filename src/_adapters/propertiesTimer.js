/**
 * propertiesTimer.js
 * Collects properties every interval
 * Uses the NodeJS built in timer
 * @class
 */

const config = require('./configuration');
const gateway = require('../_agent/interface');
const persistance = require('../_persistance/interface');
const Log = require('../_classes/logger');
let customTimer = require('../_classes/timer');

 module.exports = class propertiesTimer extends customTimer{

    constructor(){
        super();
    }

    // Inherits start() and stop()

    // Private functions

    /**
     * Define some activity that needs to be repeated in intervals of time
     */
    async _action(){
        let logger = new Log();
        try{
            let mapper = await persistance.getMappers();
            logger.debug(mapper)
            for(let i=0, l=mapper.length; i<l; i++){
                if(mapper[i].interaction === 'property'){
                    let response = await gateway.getProperty(config.serviceOid, mapper[i].oid, mapper[i].interaction_id);
                    // DO STH WITH THE RESPONSE
                    logger.info(JSON.stringify(response), 'ADAPTER');
                }
            }
        } catch(err) {
            logger.error(err, 'ADAPTER');
            return Promise.resolve(err);
        }
    }

}