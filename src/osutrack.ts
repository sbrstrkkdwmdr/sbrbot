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
    let enableTrack = config.enableTracking;

    if (enableTrack == true) {
        setInterval(() => {
            try {
                trackfunc.trackUsers(trackDb, client, guildSettings)
            } catch (err) {
                console.log(err)
                console.log('temporarily disabling tracking for an hour')
                enableTrack = false;
                setTimeout(() => {
                    enableTrack = true;
                }, 1000 * 60 * 60);
            }
        }, 60 * 1000 * 15); //requests every 15 min
    }
    function a() {
        return 'string'
    }
}
