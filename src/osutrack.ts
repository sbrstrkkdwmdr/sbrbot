import Discord from 'discord.js';
import fs from 'fs';
import Sequelize from 'sequelize';
import * as def from './consts/defaults.js';
import * as embedstuff from './embed.js';
import * as log from './log.js';
import * as osufunc from './osufunc.js';
import * as func from './tools.js';
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

    if (enableTrack == true) {
        a();
        setInterval(() => {
            a();
        }, 60 * 1000 * 60); //requests every 60 min
    }
    function a() {
        try {
            trackfunc.trackUsers(input.trackDb, input.client, input.guildSettings);
        } catch (err) {
            console.log(err);
            console.log('temporarily disabling tracking for an hour');
            enableTrack = false;
            setTimeout(() => {
                enableTrack = true;
            }, 1000 * 60 * 60);
        }
    }
};
