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
    execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;


        let commandCategory: string = 'default';
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
                command = overrides.ex
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
                [{
                    name: 'command',
                    value: command
                }]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        const useEmbeds = []

        if (command != null) {
            const fetchcmd = command.toString()
            const commandInfo = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.info.dec)
            if (info.cmds.find(obj => obj.name == fetchcmd)) {
                commandCategory = 'gen';
                const res = info.cmds.find(obj => obj.name == fetchcmd)

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

            } else if (info.othercmds.find(obj => obj.name == fetchcmd)) {
                commandCategory = 'misc';
                const res = info.othercmds.find(obj => obj.name == fetchcmd)

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
            } else if (info.osucmds.find(obj => obj.name == fetchcmd)) {
                commandCategory = 'osu';
                
                const res = info.osucmds.find(obj => obj.name == fetchcmd)


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
            else if (info.admincmds.find(obj => obj.name == fetchcmd)) {
                commandCategory = 'admin';
                
                const res = info.admincmds.find(obj => obj.name == fetchcmd)


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

            if (command.includes('CategoryMenu')) {
                switch (true) {
                    case command.includes('gen'): {
                        commandInfo.setTitle("General Commands");
                        let desctxt = '';
                        for(let i = 0; i < info.cmds.length; i++) {
                            desctxt += `\n\`${info.cmds[i].name}\`: ${info.cmds[i].description}`;
                        }
                        if(desctxt == '') {
                            desctxt = 'No commands in this category';
                        }
                        commandInfo.setDescription(desctxt);
                        commandCategory = 'gen';
                    }
                        break;
                    case command.includes('osu'): {
                        commandInfo.setTitle("osu! Commands");
                        let desctxt = '';
                        for(let i = 0; i < info.osucmds.length; i++) {
                            desctxt += `\n\`${info.osucmds[i].name}\`: ${info.osucmds[i].description}`;
                        }
                        if(desctxt == '') {
                            desctxt = 'No commands in this category';
                        }
                        commandInfo.setDescription(desctxt);
                        commandCategory = 'osu';
                    }
                        break;
                    case command.includes('admin'): {
                        commandInfo.setTitle("Admin Commands");
                        let desctxt = '';
                        for(let i = 0; i < info.admincmds.length; i++) {
                            desctxt += `\n\`${info.admincmds[i].name}\`: ${info.admincmds[i].description}`;
                        }
                        if(desctxt == '') {
                            desctxt = 'No commands in this category';
                        }
                        commandInfo.setDescription(desctxt);
                        commandCategory = 'admin';
                    }
                        break;
                    case command.includes('misc'): {
                        commandInfo.setTitle("General Commands");
                        let desctxt = ''
                        for(let i = 0; i < info.othercmds.length; i++) {
                            desctxt += `\n\`${info.othercmds[i].name}\`: ${info.othercmds[i].description}`;
                        }
                        if(desctxt == '') {
                            desctxt = 'No commands in this category';
                        }
                        commandInfo.setDescription(desctxt);
                        commandCategory = 'misc';
                    }
                        break;
                }
            }
            useEmbeds.push(commandInfo)
        } else {
            useEmbeds.push(fullCommandList)
            commandCategory = 'default';
        }

        const inputMenu = new Discord.SelectMenuBuilder()
            .setCustomId(`SelectMenu-help-${commanduser.id}`)
            .setPlaceholder('Select a command')

        switch (commandCategory) {
            case 'gen': {
                for (let i = 0; i < info.cmds.length; i++) {
                    inputMenu.addOptions(
                        new Discord.SelectMenuOptionBuilder()
                            .setEmoji('📜')
                            .setLabel(`#${i+1}`)
                            .setDescription(info.cmds[i].name)
                            .setValue(info.cmds[i].name)
                    )
                }
            }
                break;
            case 'osu': {
                for (let i = 0; i < info.osucmds.length; i++) {
                    inputMenu.addOptions(
                        new Discord.SelectMenuOptionBuilder()
                            .setEmoji('📜')
                            .setLabel(`#${i+1}`)
                            .setDescription(info.osucmds[i].name)
                            .setValue(info.osucmds[i].name)
                    )
                }
            }
                break;
            case 'admin':
                {
                    for (let i = 0; i < info.admincmds.length; i++) {
                        inputMenu.addOptions(
                            new Discord.SelectMenuOptionBuilder()
                                .setEmoji('📜')
                                .setLabel(`#${i+1}`)
                                .setDescription(info.admincmds[i].name)
                                .setValue(info.admincmds[i].name)
                        )
                    }
                }
                break;
            case 'misc': {
                for (let i = 0; i < info.othercmds.length; i++) {
                    inputMenu.addOptions(
                        new Discord.SelectMenuOptionBuilder()
                            .setEmoji('📜')
                            .setLabel(`#${i+1}`)
                            .setDescription(info.othercmds[i].name)
                            .setValue(info.othercmds[i].name)
                    )
                }
            }
                break;
            default: {
                inputMenu.addOptions(
                    new Discord.SelectMenuOptionBuilder()
                        .setEmoji('📜')
                        .setLabel('General')
                        .setValue('CategoryMenu-gen'),
                    new Discord.SelectMenuOptionBuilder()
                        .setEmoji(emojis.gamemodes.standard)
                        .setLabel('osu!')
                        .setValue('CategoryMenu-osu'),
                    new Discord.SelectMenuOptionBuilder()
                        .setEmoji('🤖')
                        .setLabel('Admin')
                        .setValue('CategoryMenu-admin'),
                    new Discord.SelectMenuOptionBuilder()
                        .setEmoji('❓')
                        .setLabel('Misc')
                        .setValue('CategoryMenu-misc'),
                )
            }
                break;
        }

        const arr = new Discord.ActionRowBuilder()
            .addComponents(
                inputMenu
            )

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: useEmbeds,
                    components: [arr],
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
                    components: [arr],
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
                    embeds: useEmbeds,
                    components: [arr],
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