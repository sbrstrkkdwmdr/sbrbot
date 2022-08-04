const commandhelp = require('../../configs/info')
import fs = require('fs')
module.exports = {
    name: 'help',
    description: 'Displays all commands\n' +
        'Command: `sbr-help`\n' +
        'Slash command: `/help [command]`\n' +
        'Options:\n' +
        '`command` - string, optional. The command to get help for. If omitted, all commands will be displayed.\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let i: number;
        let fullCommandList = new Discord.EmbedBuilder()
            .setColor('#0099ff')
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

                /* {
                name: 'Main commands',
                value: `**ping** - Displays the bot's ping\n` +
                    `**help** - Displays this message\n` +
                    '**remind** \`[time] [reminder] [sendinchannel]\` - creates a reminder\n' +
                    '**math** \`[expression]\` - evaluates a math expression\n' +
                    '**convert** \`[from] [to] [value]\` - converts a value from one unit to another\n'
                , inline: false
            },
            {
                name: 'osu! commands',
                value: `**leaderboard** \`[id] [page] [mods]\` - displays the top five plays of a map \n` +
                    `**osu** \`[user] [detailed]\`- displays a user's profile\n` +
                    `**osuset** \`[user] [mode]\` - sets your osu! username\n` +
                    `**osutop** \`[user] [mode] [sort] [reverse] [page] [mapper] [mods] [detailed] [compact]\` - displays the user's top plays\n` +
                    `**map** \`[id] [mods] [detailed]\` - displays the map info for a beatmap\n` +
                    `**rs** \`[user] [page] [mode] [list]\`  - displays the most recent score for the user\n` +
                    `**scores** \`[user] [id] [sort] [reverse] [compact]\` - displays the users scores for a given beatmap`
                , inline: false
            }, {
                name: 'Admin commands',
                value: '**checkperms** \`[user]\` - checks the permissions of a given user\n' +
                    '**leaveguild** \`[guild]\` - leaves a given server\n' +
                    '**servers** - displays all servers the bot is in\n' +
                    '**voice** \`[user(required)] [type(required)] [channel]\` - alters a user in a voice channel\n' +
                    '**servers** - displays all servers the bot is in', inline: false
            },
            {
                name: 'General commands',
                value: '**gif** \`[type]\` - displays a gif of a given type\n' +
                    '**ytsearch** \`[query]\` - searches youtube for a given query\n' +
                    '**image** \`[query]\` - searches google images for a given query\n' +
                    '**8ball** - responds with a yes/no/maybe/??? answer  \n' +
                    '**roll** \`[number]\` - returns a number between 1-100 (or the given number)\n' +
                    '**poll** \`[question] [options]\` - creates a poll\n' +
                    ''
                    , 
                    inline: false
            },
            {
                name: 'Music commands (WIP)',
                value: '**play** \`[query]\` - plays a song from youtube\n' +
                    '**skip** - skips the current song\n' +
                    '**stop** - stops the current song\n' +
                    '**pause** - pauses the current song\n' +
                    '**resume** - resumes the current song\n' +
                    '**queue** - displays the current queue\n' +
                    '**np** - displays the current song\n'
                , inline: false
            } */
            ])
            .setFooter({
                text: 'Website: https://sbrstrkkdwmdr.github.io/sbrbot/commands | Github: https://github.com/sbrstrkkdwmdr/sbrbot/tree/ts'
            })


        if (message != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - help (message)\n${currentDate} | ${currentDateISO}\n recieved help command\nrequested by ${message.author.id} AKA ${message.author.tag}\n`, 'utf-8')
            if (!args[0]) {
                message.reply({ embeds: [fullCommandList], allowedMentions: { repliedUser: false } })
            }
            if (args[0]) {
                let command = args[0].toString()
                let commandInfo = new Discord.EmbedBuilder()
                    .setColor('#0099ff')
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
                } else {
                    fullCommandList
                        .setDescription(`Could not find command "${command}"` + '\nuse `/help <command>` to get more info on a command')

                    return message.reply({ embeds: [fullCommandList], allowedMentions: { repliedUser: false } })
                }
                fullCommandList
                    .setDescription(`Could not find command "${command}"` + '\nuse `/help <command>` to get more info on a command')
                message.reply({ embeds: [commandInfo], allowedMentions: { repliedUser: false } })
            }
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Information\n${message.content}\n`)
        }



        if (interaction != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - help (interaction)\n${currentDate} | ${currentDateISO}\n recieved help command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}\n`, 'utf-8')

            let command = interaction.options.getString('command')
            let commandInfo = new Discord.EmbedBuilder()
                .setColor('#0099ff')
            if (commandhelp.cmds.find(obj => obj.name == command)) {

                let res = commandhelp.cmds.find(obj => obj.name == command)

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

            } else if (commandhelp.othercmds.find(obj => obj.name == command)) {
                let res = commandhelp.othercmds.find(obj => obj.name == command)

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
            } else if (commandhelp.osucmds.find(obj => obj.name == command)) {
                let res = commandhelp.osucmds.find(obj => obj.name == command)


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
            else if (commandhelp.admincmds.find(obj => obj.name == command)) {
                let res = commandhelp.admincmds.find(obj => obj.name == command)


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

            } else if (commandhelp.links.find(obj => obj.name == command)) {

                let res = commandhelp.links.find(obj => obj.name == command)


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
            } else if (commandhelp.musiccmds.find(obj => obj.name == command)) {
                let res = commandhelp.musiccmds.find(obj => obj.name == command)


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
            else {
                fullCommandList
                    .setDescription(`Could not find command "${command}"` + '\nuse `/help <command>` to get more info on a command')
                return interaction.reply({ embeds: [fullCommandList], allowedMentions: { repliedUser: false } })
            }
            interaction.reply({ embeds: [commandInfo], allowedMentions: { repliedUser: false } })
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Information\nCommand: ${command}\n`)

        }

    }
}

/* module.exports = {
    name: 'help',
    description: 'Displays all commands\n' +
        'Command: `sbr-help`\n' +
        'Slash command: `/help [command]`\n' +
        'Options:\n' +
        '`command` - string, optional. The command to get help for. If omitted, all commands will be displayed.\n',
    execute(message, client, Discord, interaction, currentDate, currentDateISO, config) {

        let fullCommandList = new Discord.EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Command List')
            .setDescription('use `/help <command>` to get more info on a command')
            .addField('Main commands',
                `**ping** - Displays the bot's ping\n` +
                `**help** - Displays this message\n`
                , false)
            .addField('osu! commands',
                `**osu** \`[user]\`- displays a user's profile\n` +
                `**osuset** \`[user] [mode]\` - sets your osu! username\n` +
                `**osutop** \`[user] [mode] [sort] [page] [mapper] [detailed (booleanoptional)]\` - displays the user's top plays\n` +
                `**map** \`[id] [mods]\` - displays the map info for a beatmap\n` +
                `**rs** \`[user] [mode] [offset]\`  - displays the most recent score for the user\n` +
                `[WIP]**scores** \`[user] [id] [sort]\` - displays the users scores for a given beatmap`
                , false)
            .addField('admin commands',
                '[WIP]**checkperms** \`[user]\` - checks the permissions of a given user\n' +
                '[WIP]**leaveguild** \`[guild]\` - leaves a given server\n' +
                '[WIP]**servers** - displays all servers the bot is in', false)
            .addField('other commands',
                '[WIP]**gif** \`[type]\` - displays a gif of a given type\n' +
                '[WIP]**ytsearch** \`[query]\` - searches youtube for a given query\n' +
                '[WIP]**imagesearch** \`[query]\` - searches google images for a given query\n' +
                '[WIP]**remind** \`[reminder] [time]\` - creates a reminder\n' +
                '[WIP]**math** \`[expression]\` - evaluates a math expression\n' +
                '[WIP]**convert** \`[value] [from] [to]\` - converts a value from one unit to another\n', false
            )


        if (message != null) {
            message.reply({ embeds: [fullCommandList] })
        }



        if (interaction != null) {
            let command = interaction.options.getString('command')
            let commandInfo = new Discord.EmbedBuilder()
                .setColor('#0099ff')
            if (client.commands.get(command)) {

                commandInfo.setTitle(client.commands.get(command).name)
                commandInfo.setDescription(client.commands.get(command).description)

            } else if (client.osucmds.get(command)) {

                commandInfo.setTitle(client.osucmds.get(command).name)
                commandInfo.setDescription(client.osucmds.get(command).description)

            }
            else if (client.admincmds.get(command)) {

                commandInfo.setTitle(client.admincmds.get(command).name)
                commandInfo.setDescription(client.admincmds.get(command).description)

            } else if (client.links.get(command)) {

                commandInfo.setTitle(client.links.get(command).name)
                commandInfo.setDescription(client.links.get(command).description)
            }
            else {
                return interaction.reply({ embeds: [fullCommandList] })
            }
            interaction.reply({ embeds: [commandInfo] })

        }

    }
} */