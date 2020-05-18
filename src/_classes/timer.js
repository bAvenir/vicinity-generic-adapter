/**
 * timer.js
 * Support to send events or collect properties
 * Uses the NodeJS built in timer
 * @class
 */

const config = require('../_configuration/configuration');

 module.exports = class customTimer{

    constructor() {}

    start(){
        this.collectTimer = setInterval(this._action, config.timerInterval);
    }

    stop(){
        clearInterval(this.collectTimer);
    }

    // Private functions

    /**
     * Define some activity that needs to be repeated in intervals of time
     */
    _action(){}

}