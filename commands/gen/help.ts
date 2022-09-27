import fs = require('fs');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
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
                    value: '`' + info.cmds.map(x => x.name + '`,').join(' `'),
                    inline: false
                },
                {
                    name: 'osu! comands',
                    value: '`' + info.osucmds.map(x => x.name + '`,').join(' `'),
                    inline: false
                },
                {
                    name: 'Admin commands',
                    value: '`' + info.admincmds.map(x => x.name + '`,').join(' `'),
                    inline: false
                },
                {
                    name: 'Other/misc commands',
                    value: '`' + info.othercmds.map(x => x.name + '`,').join(' `'),
                    inline: false
                },
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

        //==============================================================================================================================================================================================

        log.logFile(
            'command',
            log.commandLog('help', commandType, absoluteID, commanduser
            ),
            {
                guildId: `${obj.guildId}`
            })

        //OPTIONS==============================================================================================================================================================================================

        log.logFile('command',
            log.optsLog(absoluteID, [{
                name: 'Command',
                value: command
            }]),
            {
                guildId: `${obj.guildId}`
            }
        )
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        const useEmbeds = []

        function commandEmb(command: info.commandInfo, embed) {
            let desc = ''
            desc += command.description + "\n"
            if (command.usage) {
                desc += `\nCommand: \`${config.prefix}${command.usage}\``
            }
            if (command.slashusage) {
                desc += `\nSlash Command: \`/${command.slashusage}\``
            }

            const opts = command.options
            let opttxt = '';
            for (let i = 0; i < opts.length; i++) {
                const reqtxt = opts[i].required ? 'required' : 'optional'
                opttxt += `\n\`${opts[i].name} (${opts[i].type}, ${reqtxt})\`: ${opts[i].description}\n`

            }

            let commandaliases = command.aliases && command.aliases.length > 0 ? command.aliases.join(', ') : 'none'
            let commandexamples = command.examples && command.examples.length > 0 ? command.examples.join('\n') : 'none'

            embed.setTitle("Command info for: " + command.name)
            embed.setDescription(desc)
            embed.addFields([
                {
                    name: 'Options',
                    value: opttxt,
                    inline: false
                },
                {
                    name: 'Aliases',
                    value: commandaliases,
                    inline: false
                },
                {
                    name: 'Examples',
                    value: commandexamples,
                    inline: false
                }
            ])
        }

        if (command != null) {
            const fetchcmd = command.toString()
            const commandInfo = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.info.dec)
            if (info.cmds.find(obj => obj.name == fetchcmd)) {
                commandCategory = 'gen';
                const res = info.cmds.find(obj => obj.name == fetchcmd)
                commandEmb(res, commandInfo)
            } else if (info.othercmds.find(obj => obj.name == fetchcmd)) {
                commandCategory = 'misc';
                const res = info.othercmds.find(obj => obj.name == fetchcmd)
                commandEmb(res, commandInfo)
            } else if (info.osucmds.find(obj => obj.name == fetchcmd)) {
                commandCategory = 'osu';
                const res = info.osucmds.find(obj => obj.name == fetchcmd)
                commandEmb(res, commandInfo)
            } else if (info.admincmds.find(obj => obj.name == fetchcmd)) {
                commandCategory = 'admin';
                const res = info.admincmds.find(obj => obj.name == fetchcmd)
                commandEmb(res, commandInfo)
            }


            if (command.includes('CategoryMenu')) {
                switch (true) {
                    case command.includes('gen'): {
                        commandInfo.setTitle("General Commands");
                        let desctxt = '';
                        for (let i = 0; i < info.cmds.length; i++) {
                            desctxt += `\n\`${info.cmds[i].name}\`: ${info.cmds[i].description}`;
                        }
                        if (desctxt == '') {
                            desctxt = 'No commands in this category';
                        }
                        commandInfo.setDescription(desctxt);
                        commandCategory = 'gen';
                    }
                        break;
                    case command.includes('osu'): {
                        commandInfo.setTitle("osu! Commands");
                        let desctxt = '';
                        for (let i = 0; i < info.osucmds.length; i++) {
                            desctxt += `\n\`${info.osucmds[i].name}\`: ${info.osucmds[i].description}`;
                        }
                        if (desctxt == '') {
                            desctxt = 'No commands in this category';
                        }
                        commandInfo.setDescription(desctxt);
                        commandCategory = 'osu';
                    }
                        break;
                    case command.includes('admin'): {
                        commandInfo.setTitle("Admin Commands");
                        let desctxt = '';
                        for (let i = 0; i < info.admincmds.length; i++) {
                            desctxt += `\n\`${info.admincmds[i].name}\`: ${info.admincmds[i].description}`;
                        }
                        if (desctxt == '') {
                            desctxt = 'No commands in this category';
                        }
                        commandInfo.setDescription(desctxt);
                        commandCategory = 'admin';
                    }
                        break;
                    case command.includes('misc'): {
                        commandInfo.setTitle("General Commands");
                        let desctxt = ''
                        for (let i = 0; i < info.othercmds.length; i++) {
                            desctxt += `\n\`${info.othercmds[i].name}\`: ${info.othercmds[i].description}`;
                        }
                        if (desctxt == '') {
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
                            .setLabel(`#${i + 1}`)
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
                            .setLabel(`#${i + 1}`)
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
                                .setLabel(`#${i + 1}`)
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
                            .setLabel(`#${i + 1}`)
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
                    .catch(() => { });
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