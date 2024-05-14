import * as Discord from 'discord.js';
import fs from 'fs';
import Sequelize from 'sequelize';
import * as def from './consts/defaults.js';
import * as embedstuff from './embed.js';
import * as func from './func.js';
import * as log from './log.js';
import * as osufunc from './osufunc.js';
import * as trackfunc from './trackfunc.js';
import * as osuApiTypes from './types/osuApiTypes.js';

export default (input: {
    userdata,
    client,
    config,
    oncooldown,
    trackDb: Sequelize.ModelStatic<any>,
    guildSettings: Sequelize.ModelStatic<any>;
}) => {
    // trackUsers(trackDb)
    let enableTrack = input.config.enableTracking;
    const totalTime = 60 * 1000 * 60 //requests every 60 min
    if (enableTrack == true) {
        a();
        setInterval(() => {
            a();
        }, totalTime); 
    }
    function a() {
        try {
            trackfunc.trackUsers(input.trackDb, input.client, input.guildSettings, totalTime, input.config);
        } catch (err) {
            console.log(err);
            console.log('temporarily disabling tracking for an hour');
            enableTrack = false;
            setTimeout(() => {
                enableTrack = true;
            }, totalTime);
        }
    }
};
