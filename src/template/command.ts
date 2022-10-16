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
import func = require('../tools');
import def = require('../../src/consts/defaults');
import buttonsthing = require('../../src/consts/buttons');
import extypes = require('../../src/types/extraTypes');
import msgfunc = require('../../commands/msgfunc');


module.exports = {
    name: 'COMMANDNAME',
    async execute(input: {
        commandType: extypes.commandType,
        obj: extypes.commandObject,
        args: string[],
        button: string,
        config: extypes.config,
        client: Discord.Client,
        absoluteID: number,
        currentDate: Date,
        overrides: extypes.overrides,
        userdata: extypes.data,
    }) {
        let commanduser: Discord.User;


        switch (input.commandType) {
            case 'message': {
                //@ts-expect-error author property only exists on message
                commanduser = input.obj.author;
            }
                break;
            //==============================================================================================================================================================================================
            case 'interaction': {
                commanduser = input.obj.member.user;
            }
                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = input.obj.member.user;
            }
                break;
        }
        if (input.overrides != null) {

        }
        //==============================================================================================================================================================================================

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-COMMANDNAME-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.first),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-COMMANDNAME-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.previous),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-COMMANDNAME-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.next),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-COMMANDNAME-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.last),
            );
        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`Refresh-COMMANDNAME-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.main.refresh),
            );

        log.logFile(
            'command',
            log.commandLog('COMMANDNAME', input.commandType, input.absoluteID, commanduser
            ),
            {
                guildId: `${input.obj.guildId}`
            })
        //OPTIONS==============================================================================================================================================================================================
        log.logFile('command',
            log.optsLog(input.absoluteID, []),
            {
                guildId: `${input.obj.guildId}`
            }
        )

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================



        //SEND/EDIT MSG==============================================================================================================================================================================================
        msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
            }
        })

        log.logFile('command',
            `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
    }
}