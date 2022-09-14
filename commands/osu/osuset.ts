import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');

module.exports = {
    name: 'osuset',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let name;
        let mode;
        let skin;

        let type;
        let value;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                name = args.join(' ');
                switch (args[0]) {
                    case 'mode':
                        type = 'mode';
                        value = args.join(' ').slice(type.length);
                        break;
                    case 'skin':
                        type = 'skin';
                        value = args.join(' ').slice(type.length);
                        break;
                    default:
                        type = 'name';
                        if (args[0] == 'name') {
                            value = args.join(' ').slice(type.length);
                        } else {
                            value = args.join(' ');
                        }
                        break;
                }
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                name = obj.options.getString('user');
                mode = obj.options.getString('mode');
                skin = obj.options.getString('skin');
                type = 'interaction';
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }
        if (overrides != null) {

        }

        //==============================================================================================================================================================================================

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-osuset-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅'),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-osuset-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-osuset-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶'),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-osuset-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡'),
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'osuset',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [{
                    name: 'Name',
                    value: name
                },
                {
                    name: 'Mode',
                    value: mode
                },
                {
                    name: 'Skin',
                    value: skin
                },
                {
                    name: 'Type',
                    value: type
                },
                {
                    name: 'Value',
                    value: value
                },
                ]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (typeof name == 'undefined' || name == null) {
            obj.reply({
                content: 'Error - username undefined',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            });
            return;
        }
        //+[------->++<]>++.-----------.+++++++++.-----.++++++++++.

        let txt = 'null'

        let updateRows: any = {
            userid: commanduser.id
        }
        switch (type) {
            case 'name': {
                updateRows = {
                    userid: commanduser.id,
                    osuname: value
                }
            }
                break;
            case 'mode': {
                updateRows = {
                    userid: commanduser.id,
                    mode: value
                }
            }
                break;
            case 'mode': {
                updateRows = {
                    userid: commanduser.id,
                    skin: value
                }
            }
            case 'interaction': {
                updateRows = {
                    userid: commanduser.id,
                    osuname: name
                }
                if (mode != null) {
                    updateRows['mode'] = mode;
                }
                if (skin != null) {
                    updateRows['skin'] = skin;
                }
            }
                break;
        }

        const findname = await userdata.findOne({ where: { userid: commanduser.id } })
        if (findname == null) {
            try {
                await userdata.create({
                    userid: commanduser.id,
                    osuname: name,
                    mode: mode ?? 'osu',
                    skin: skin ?? 'Default - https://osu.ppy.sh/community/forums/topics/129191?n=117'
                })
                txt = 'Updated the database'
            } catch (error) {
                txt = 'There was an error trying to update your settings'
                log.errLog('Database error', error, `${absoluteID}`)
            }
        } else {
            const affectedRows = await userdata.update(updateRows, { where: { userid: commanduser.id } })

            if (affectedRows > 0) {
                txt = 'Updated the database'
            } else {
                txt = 'There was an error trying to update your settings'
                log.errLog('Database error', affectedRows, `${absoluteID}`)
            }
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: txt,
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                obj.reply({
                    content: txt,
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.edit({
                    content: '',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
        }



        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}