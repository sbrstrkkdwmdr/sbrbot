import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
const commandhelp = require('../../configs/info');
module.exports = {
    name: 'help',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let i: number;
        let command:string;
        let fullCommandList = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.info.hex)
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

        if (message != null && interaction == null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - help (message)
${currentDate} | ${currentDateISO}
recieved help command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            command = args[0];
            if(!args[0]){
                command = null
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - help (interaction)
${currentDate} | ${currentDateISO}
recieved help command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            command = interaction.options.getString('command');
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - help (interaction)
${currentDate} | ${currentDateISO}
recieved help command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}
command: ${command}
----------------------------------------------------
`, 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        let useEmbeds = []
        if (command != null) {
            let fetchcmd = command.toString()
            let commandInfo = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.info.hex)
            if (commandhelp.cmds.find(obj => obj.name == args[0])) {

                let res = commandhelp.cmds.find(obj => obj.name == args[0])

                let desc = ''
                desc += res.description + "\n"
                if (res.usage) {
                    desc += `\nCommand: \`${config.prefix}${res.usage}\``
                }
                if (res.slashusage) {
                    desc += `\nSlash Command: \`${res.slashusage}\``
                }

                let opts = res.options
                let opttxt = '';
                for (i = 0; i < opts.length; i++) {
                    opttxt += `\n\`${opts[i].name}\`: ${opts[i].description}`

                }
                desc += "\n\n" + opttxt

                if (res.aliases) {
                    desc += `\n\nAliases: ${res.aliases}`
                }

                commandInfo.setTitle("Command info for: " + res.name)
                commandInfo.setDescription(desc)

            } else if (commandhelp.othercmds.find(obj => obj.name == args[0])) {
                let res = commandhelp.othercmds.find(obj => obj.name == args[0])

                let desc = ''
                desc += res.description + "\n"
                if (res.usage) {
                    desc += `\nCommand: \`${config.prefix}${res.usage}\``
                }
                if (res.slashusage) {
                    desc += `\nSlash Command: \`${res.slashusage}\``
                }

                let opts = res.options
                let opttxt = '';
                for (i = 0; i < opts.length; i++) {
                    opttxt += `\n\`${opts[i].name}\`: ${opts[i].description}`

                }
                desc += "\n\n" + opttxt

                if (res.aliases) {
                    desc += `\n\nAliases: ${res.aliases}`
                }

                commandInfo.setTitle("Command info for: " + res.name)
                commandInfo.setDescription(desc)
            } else if (commandhelp.osucmds.find(obj => obj.name == args[0])) {
                let res = commandhelp.osucmds.find(obj => obj.name == args[0])


                let desc = ''
                desc += res.description + "\n"
                if (res.usage) {
                    desc += `\nCommand: \`${config.prefix}${res.usage}\``
                }
                if (res.slashusage) {
                    desc += `\nSlash Command: \`${res.slashusage}\``
                }

                let opts = res.options
                let opttxt = '';
                for (i = 0; i < opts.length; i++) {
                    opttxt += `\n\`${opts[i].name}\`: ${opts[i].description}`

                }
                desc += "\n\n" + opttxt

                if (res.aliases) {
                    desc += `\n\nAliases: ${res.aliases}`
                }

                commandInfo.setTitle("Command info for: " + res.name)
                commandInfo.setDescription(desc)

            }
            else if (commandhelp.admincmds.find(obj => obj.name == args[0])) {
                let res = commandhelp.admincmds.find(obj => obj.name == args[0])


                let desc = ''
                desc += res.description + "\n"
                if (res.usage) {
                    desc += `\nCommand: \`${config.prefix}${res.usage}\``
                }
                if (res.slashusage) {
                    desc += `\nSlash Command: \`${res.slashusage}\``
                }

                let opts = res.options
                let opttxt = '';
                for (i = 0; i < opts.length; i++) {
                    opttxt += `\n\`${opts[i].name}\`: ${opts[i].description}`

                }
                desc += "\n\n" + opttxt

                if (res.aliases) {
                    desc += `\n\nAliases: ${res.aliases}`
                }

                commandInfo.setTitle("Command info for: " + res.name)
                commandInfo.setDescription(desc)

            } else if (commandhelp.links.find(obj => obj.name == args[0])) {

                let res = commandhelp.links.find(obj => obj.name == args[0])


                let desc = ''
                desc += res.description + "\n"
                if (res.usage) {
                    desc += `\nUsage: ${res.usage}`
                }

                let opts = res.options
                let opttxt = '';
                for (i = 0; i < opts.length; i++) {
                    opttxt += `\n\`${opts[i].name}\`: ${opts[i].description}`

                }
                desc += "\n\n" + opttxt

                if (res.aliases) {
                    desc += `\n\nAliases: ${res.aliases}`
                }

                commandInfo.setTitle("Command info for: " + res.name)
                commandInfo.setDescription(desc)
            } else if (commandhelp.musiccmds.find(obj => obj.name == args[0])) {
                let res = commandhelp.musiccmds.find(obj => obj.name == args[0])


                let desc = ''
                desc += res.description + "\n"
                if (res.usage) {
                    desc += `\nCommand: \`${config.prefix}${res.usage}\``
                }
                if (res.slashusage) {
                    desc += `\nSlash Command: \`${res.slashusage}\``
                }

                let opts = res.options
                let opttxt = '';
                for (i = 0; i < opts.length; i++) {
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

        if (message != null && interaction == null && button == null) {
            message.reply({
                embeds: useEmbeds,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }
        if (interaction != null && button == null && message == null) {
            interaction.reply({
                embeds: useEmbeds,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }
        if (button != null) {
            message.edit({
                content: '',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
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