import osufunc = require('./osufunc');
import osuApiTypes = require('./types/osuApiTypes');
import Sequelize = require('sequelize');
import fs = require('fs');
import Discord = require('discord.js');
import func = require('./tools');
import embedstuff = require('./embed');
import log = require('./log');
import def = require('./consts/defaults');
import trackfunc = require('./trackfunc');

module.exports = (userdata, client, config, oncooldown, trackDb: Sequelize.ModelStatic<any>, guildSettings: Sequelize.ModelStatic<any>) => {
    // trackUsers(trackDb)
    if (config.enableTracking == true) {
        setInterval(() => {
            trackfunc.trackUsers(trackDb, client, guildSettings)
        }, 60 * 1000 * 15); //requests every 15 min
    }
    function a(){
        return 'string'
    }
}
