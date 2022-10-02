import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import colourfunc = require('../../src/colourcalc');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');
import func = require('../../src/other');
import def = require('../../src/consts/defaults');
import buttonsthing = require('../../src/consts/buttons');
import extypes = require('../../src/types/extraTypes');

module.exports = {
    name: 'rankpp',
    async execute(commandType: extypes.commandType, obj, args: string[], button: string, config: extypes.config, client: Discord.Client, absoluteID: number, currentDate: Date, overrides, userdata) {
        let commanduser;
        let type: string = 'rank';
        let value;
        let mode:osuApiTypes.GameMode = 'osu';
        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                value = args[0] ?? 100;
            }
                break;
            //==============================================================================================================================================================================================
            case 'interaction': {
                commanduser = obj.member.user;
            }
                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }
        if (overrides != null) {
            type = overrides.type ?? 'pp';
        }
        //==============================================================================================================================================================================================


        log.logFile(
            'command',
            log.commandLog('rankpp', commandType, absoluteID, commanduser
            ),
            {
                guildId: `${obj.guildId}`
            })
        //OPTIONS==============================================================================================================================================================================================
        log.logFile('command',
            log.optsLog(absoluteID, []),
            {
                guildId: `${obj.guildId}`
            }
        )

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        const Embed = new Discord.EmbedBuilder()
            .setTitle('null')
            .setDescription('null')

        let returnval: string | number;

        switch (type) {
            case 'pp': {
                returnval = await osufunc.getRankPerformance('pp->rank', value, userdata, mode);
                if (typeof returnval == 'number') {
                    returnval = '#' + func.separateNum(returnval)
                } else {
                    returnval = 'null'
                }
                Embed
                    .setTitle(`Approximate rank for ${value}pp`)
                    .setDescription(`Rank: ${returnval}`)
            }
                break;
            case 'rank': {

                returnval = await osufunc.getRankPerformance('rank->pp', value, userdata, mode);

                if (typeof returnval == 'number') {
                    returnval = func.separateNum(returnval) + 'pp'
                } else {
                    returnval = 'null'
                }

                Embed
                    .setTitle(`Approximate performance for rank #${value}`)
                    .setDescription(`${returnval}`)
            }
                break;
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [Embed],
                    files: [],
                    components: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
            //==============================================================================================================================================================================================
            case 'interaction': {
                obj.reply({
                    content: '',
                    embeds: [Embed],
                    files: [],
                    components: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.message.edit({
                    content: '',
                    embeds: [],
                    files: [],
                    components: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
        }
        log.logFile('command',
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`,
            { guildId: `${obj.guildId}` }
        )
    }
}