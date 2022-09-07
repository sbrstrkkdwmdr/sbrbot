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
    name: 'skin',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;
        let string: string;
        let searchid: string;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;

                string = args.join(' ')

            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                string = obj.options.getString('string')
                if (!string) {
                    string = obj.options.getUser('user');
                }
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

        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-skin-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅'),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-skin-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-skin-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶'),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-skin-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡'),
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'skin',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                []
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        let userF;
        let findType: 'string' | 'id'
        switch (true) {
            case (searchid != commanduser.id): {
                findType = 'id'
            }
                break;
            case (string != null): {
                findType = 'string'
            }
                break;
            default: {
                findType = 'id'
            }
        }

        if (findType == 'id') {
            userF = await userdata.findOne({
                where: {
                    userid: commanduser.id
                }
            })
        } else {
            userF = await userdata.findOne({
                where: {
                    osuname: string
                }
            })
        }
        let skinstring;
        if (userF) {
            skinstring = `${userF.get('skin')}`
        } else {
            skinstring = `User is not saved in the database`
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: skinstring,
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
                    content: skinstring,
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