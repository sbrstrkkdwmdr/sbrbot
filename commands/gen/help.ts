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
import info = require('../../src/consts/helpinfo');

module.exports = {
    name: 'help',
    execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides) {
        let commanduser;

        let command: string;
        const fullCommandList = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.info.dec)
            .setTitle('Command List')
            .setDescription('use `/help <command>` to get more info on a command')
            .addFields([
                {
                    name: 'Main commands',
                    value: "`convert`, `help`,  `ping`, `math`, `remind`, `stats`",
                    inline: false
                },
                {
                    name: 'osu! comands',
                    value: "`compare`, `firsts`, `lb`, `leaderboard`(map), `map`, `osu`, `osuset`, `osutop`, `pinned`, `rs`, `scores`, `simulate`,`skin`, `whatif`",
                    inline: false
                },
                {
                    name: 'Admin commands',
                    value: "`checkperms`, `find`, `leaveguild`, `log`, `servers`, `voice`",
                    inline: false
                },
                {
                    name: 'Other/misc commands',
                    value: "`8ball`,  `gif`, `image`, `poll`, `roll`, `ytsearch`",
                    inline: false
                },
                {
                    name: 'WIP',
                    value: "`play`, `np`, `skip`, `pause`, `queue`, `resume`",
                    inline: false
                }
            ])
            .setFooter({
                text: 'Website: https://sbrstrkkdwmdr.github.io/sbrbot/commands | Github: https://github.com/sbrstrkkdwmdr/sbrbot/tree/ts'
            });

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                command = args[0];
                if (!args[0]) {
                    command = null
                }
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                command = obj.options.getString('command');
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
                    .setCustomId(`BigLeftArrow-help-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅'),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-help-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-help-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶'),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-help-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡'),
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'help',
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

        const useEmbeds = []
        if (command != null) {
            const fetchcmd = command.toString()
            const commandInfo = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.info.dec)
            if (info.cmds.find(obj => obj.name == args[0])) {

                const res = info.cmds.find(obj => obj.name == args[0])

                let desc = ''
                desc += res.description + "\n"
                if (res.usage) {
                    desc += `\nCommand: \`${config.prefix}${res.usage}\``
                }
                if (res.slashusage) {
                    desc += `\nSlash Command: \`${res.slashusage}\``
                }

                const opts = res.options
                let opttxt = '';
                for (let i = 0; i < opts.length; i++) {
                    opttxt += `\n\`${opts[i].name}\`: ${opts[i].description}`

                }
                desc += "\n\n" + opttxt

                if (res.aliases) {
                    desc += `\n\nAliases: ${res.aliases}`
                }

                commandInfo.setTitle("Command info for: " + res.name)
                commandInfo.setDescription(desc)

            } else if (info.othercmds.find(obj => obj.name == args[0])) {
                const res = info.othercmds.find(obj => obj.name == args[0])

                let desc = ''
                desc += res.description + "\n"
                if (res.usage) {
                    desc += `\nCommand: \`${config.prefix}${res.usage}\``
                }
                if (res.slashusage) {
                    desc += `\nSlash Command: \`${res.slashusage}\``
                }

                const opts = res.options
                let opttxt = '';
                for (let i = 0; i < opts.length; i++) {
                    opttxt += `\n\`${opts[i].name}\`: ${opts[i].description}`

                }
                desc += "\n\n" + opttxt

                if (res.aliases) {
                    desc += `\n\nAliases: ${res.aliases}`
                }

                commandInfo.setTitle("Command info for: " + res.name)
                commandInfo.setDescription(desc)
            } else if (info.osucmds.find(obj => obj.name == args[0])) {
                const res = info.osucmds.find(obj => obj.name == args[0])


                let desc = ''
                desc += res.description + "\n"
                if (res.usage) {
                    desc += `\nCommand: \`${config.prefix}${res.usage}\``
                }
                if (res.slashusage) {
                    desc += `\nSlash Command: \`${res.slashusage}\``
                }

                const opts = res.options
                let opttxt = '';
                for (let i = 0; i < opts.length; i++) {
                    opttxt += `\n\`${opts[i].name}\`: ${opts[i].description}`

                }
                desc += "\n\n" + opttxt

                if (res.aliases) {
                    desc += `\n\nAliases: ${res.aliases}`
                }

                commandInfo.setTitle("Command info for: " + res.name)
                commandInfo.setDescription(desc)

            }
            else if (info.admincmds.find(obj => obj.name == args[0])) {
                const res = info.admincmds.find(obj => obj.name == args[0])


                let desc = ''
                desc += res.description + "\n"
                if (res.usage) {
                    desc += `\nCommand: \`${config.prefix}${res.usage}\``
                }
                if (res.slashusage) {
                    desc += `\nSlash Command: \`${res.slashusage}\``
                }

                const opts = res.options
                let opttxt = '';
                for (let i = 0; i < opts.length; i++) {
                    opttxt += `\n\`${opts[i].name}\`: ${opts[i].description}`

                }
                desc += "\n\n" + opttxt

                if (res.aliases) {
                    desc += `\n\nAliases: ${res.aliases}`
                }

                commandInfo.setTitle("Command info for: " + res.name)
                commandInfo.setDescription(desc)

            } else if (info.links.find(obj => obj.name == args[0])) {

                const res = info.links.find(obj => obj.name == args[0])


                let desc = ''
                desc += res.description + "\n"
                if (res.usage) {
                    desc += `\nUsage: ${res.usage}`
                }

                const opts = res.params
                let opttxt = '';
                for (let i = 0; i < opts.length; i++) {
                    opttxt += `\n\`${opts[i].name}\`: ${opts[i].description}`

                }
                desc += "\n\n" + opttxt

                if (res.aliases) {
                    desc += `\n\nAliases: ${res.aliases}`
                }

                commandInfo.setTitle("Command info for: " + res.name)
                commandInfo.setDescription(desc)
            } else if (info.musiccmds.find(obj => obj.name == args[0])) {
                const res = info.musiccmds.find(obj => obj.name == args[0])


                let desc = ''
                desc += res.description + "\n"
                if (res.usage) {
                    desc += `\nCommand: \`${config.prefix}${res.usage}\``
                }
                if (res.slashusage) {
                    desc += `\nSlash Command: \`${res.slashusage}\``
                }

                const opts = res.options
                let opttxt = '';
                for (let i = 0; i < opts.length; i++) {
                    opttxt += `\n\`${opts[i].name}\`: ${opts[i].description}`

                }
                desc += "\n\n" + opttxt

                if (res.aliases) {
                    desc += `\n\nAliases: ${res.aliases}`
                }

                commandInfo.setTitle("Command info for: " + res.name)
                commandInfo.setDescription(desc)
            }
            useEmbeds.push(commandInfo)
        } else {
            useEmbeds.push(fullCommandList)
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: useEmbeds,
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
                    content: '',
                    embeds: useEmbeds,
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
                    embeds: useEmbeds,
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