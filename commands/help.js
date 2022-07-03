const commandhelp = require('../configs/info.js')
const fs = require('fs')
module.exports = {
    name: 'help',
    description: 'Displays all commands\n' +
        'Command: `sbr-help`\n' +
        'Slash command: `/help [command]`\n' +
        'Options:\n' +
        '⠀⠀`command` - string, optional. The command to get help for. If omitted, all commands will be displayed.\n',
    execute(message, args, client, Discord, interaction, currentDate, currentDateISO, config) {

        let fullCommandList = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Command List')
            .setDescription('use `/help <command>` to get more info on a command')
            .addField('Main commands',
                `**ping** - Displays the bot's ping\n` +
                `**help** - Displays this message\n` +
                '**remind** \`[time (required)] [reminder (required)]\` - creates a reminder\n' +
                '**math** \`[expression (required)]\` - evaluates a math expression\n' +
                '**convert** \`[from (required)] [to (required)] [value (required)]\` - converts a value from one unit to another\n'
                , false)
            .addField('osu! commands',
                `**leaderboard** \`[id (optional)] [page (optional)] [mods (optional)]\` - displays the top five plays of a map \n` +
                `**osu** \`[user (optional)]\`- displays a user's profile\n` +
                `**osuset** \`[user (required)] [mode (optional)]\` - sets your osu! username\n` +
                `**osutop** \`[user (optional)] [mode (optional)] [sort (optional)] [page (optional)] [mapper (optional)] [detailed (booleanoptional)]\` - displays the user's top plays\n` +
                `**map** \`[id (optional)] [mods (optional)]\` - displays the map info for a beatmap\n` +
                `**rs** \`[user (optional)] [mode (optional)] [offset (optional)]\`  - displays the most recent score for the user\n` +
                `**scores** \`[user (optional)] [id (optional)] [sort (optional)]\` - displays the users scores for a given beatmap`
                , false)
            .addField('Admin commands',
                '**checkperms** \`[user (required)]\` - checks the permissions of a given user\n' +
                '**leaveguild** \`[guild (required)]\` - leaves a given server\n' +
                '**servers** - displays all servers the bot is in\n' +
                '**voice** \`[user(required)] [type(required)] [channel (optional)]\` - alters a user in a voice channel', false)
            .addField('General commands',
                '**gif** \`[type (required)]\` - displays a gif of a given type\n' +
                '**ytsearch** \`[query (required)]\` - searches youtube for a given query\n' +
                '**image** \`[query (required)]\` - searches google images for a given query\n' +
                '**8ball** - responds with a yes/no/maybe/??? answer  \n' +
                '**roll** \`[number (optional)]\` - returns a number between 1-100 (or the given number)\n', false
            )
            .addField('Music commands (WIP)',
                '**play** \`[query (required)]\` - plays a song from youtube\n' +
                '**skip** - skips the current song\n' +
                '**stop** - stops the current song\n' +
                '**pause** - pauses the current song\n' +
                '**resume** - resumes the current song\n' +
                '**queue** - displays the current queue\n' +
                '**np** - displays the current song\n'
                , false)


        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - help (message)\n${currentDate} | ${currentDateISO}\n recieved help command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            if (!args[0]) {
                message.reply({ embeds: [fullCommandList], allowedMentions: { repliedUser: false } })
            }
            if (args[0]) {
                let command = args[0].toString()
                let commandInfo = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                if (client.commands.get(command)) {

                    let commandname = client.commands.get(command).name
                    let res = commandhelp.cmds.find(obj => obj.name == commandname)

                    let desc = ''
                    desc += res.description + "\n"
                    if (res.usage) {
                        desc += `\nCommand: \`${res.usage}\``
                    }
                    if (res.slashusage) {
                        desc += `\nSlash Command: \`${res.slashusage}\``
                    }

                    let opts = res.options
                    let opttxt = '';
                    for (i = 0; i < opts.length; i++) {
                        opttxt += `\n⠀⠀\`${opts[i].name}\`: ${opts[i].description}`

                    }
                    desc += "\n\n" + opttxt

                    if (res.aliases) {
                        desc += `\n\nAliases: ${res.aliases}`
                    }

                    commandInfo.setTitle("Command info for: " + commandname)
                    commandInfo.setDescription(desc)

                } else if (client.osucmds.get(command)) {
                    let commandname = client.osucmds.get(command).name
                    let res = commandhelp.osucmds.find(obj => obj.name == commandname)

                    let desc = ''
                    desc += res.description + "\n"
                    if (res.usage) {
                        desc += `\nCommand: \`${res.usage}\``
                    }
                    if (res.slashusage) {
                        desc += `\nSlash Command: \`${res.slashusage}\``
                    }

                    let opts = res.options
                    let opttxt = '';
                    for (i = 0; i < opts.length; i++) {
                        opttxt += `\n⠀⠀\`${opts[i].name}\`: ${opts[i].description}`

                    }
                    desc += "\n\n" + opttxt

                    if (res.aliases) {
                        desc += `\n\nAliases: ${res.aliases}`
                    }

                    commandInfo.setTitle("Command info for: " + commandname)
                    commandInfo.setDescription(desc)

                }
                else if (client.admincmds.get(command)) {

                    let commandname = client.admincmds.get(command).name
                    let res = commandhelp.admincmds.find(obj => obj.name == commandname)

                    let desc = ''
                    desc += res.description + "\n"
                    if (res.usage) {
                        desc += `\nCommand: \`${res.usage}\``
                    }
                    if (res.slashusage) {
                        desc += `\nSlash Command: \`${res.slashusage}\``
                    }

                    let opts = res.options
                    let opttxt = '';
                    for (i = 0; i < opts.length; i++) {
                        opttxt += `\n⠀⠀\`${opts[i].name}\`: ${opts[i].description}`

                    }
                    desc += "\n\n" + opttxt

                    if (res.aliases) {
                        desc += `\n\nAliases: ${res.aliases}`
                    }

                    commandInfo.setTitle("Command info for: " + commandname)
                    commandInfo.setDescription(desc)

                } else if (client.links.get(command)) {

                    let commandname = client.links.get(command).name
                    let res = commandhelp.links.find(obj => obj.name == commandname)

                    let desc = ''
                    desc += res.description + "\n"
                    if (res.usage) {
                        desc += `\nUsage: ${res.usage}`
                    }

                    let opts = res.options
                    let opttxt = '';
                    for (i = 0; i < opts.length; i++) {
                        opttxt += `\n⠀⠀\`${opts[i].name}\`: ${opts[i].description}`

                    }
                    desc += "\n\n" + opttxt

                    if (res.aliases) {
                        desc += `\n\nAliases: ${res.aliases}`
                    }

                    commandInfo.setTitle("Command info for: " + commandname)
                    commandInfo.setDescription(desc)
                } else if (client.musiccmds.get(command)){
                    let commandname = client.musiccmds.get(command).name
                    let res = commandhelp.musiccmds.find(obj => obj.name == commandname)

                    let desc = ''
                    desc += res.description + "\n"
                    if (res.usage) {
                        desc += `\nCommand: \`${res.usage}\``
                    }
                    if (res.slashusage) {
                        desc += `\nSlash Command: \`${res.slashusage}\``
                    }

                    let opts = res.options
                    let opttxt = '';
                    for (i = 0; i < opts.length; i++) {
                        opttxt += `\n⠀⠀\`${opts[i].name}\`: ${opts[i].description}`

                    }
                    desc += "\n\n" + opttxt

                    if (res.aliases) {
                        desc += `\n\nAliases: ${res.aliases}`
                    }

                    commandInfo.setTitle("Command info for: " + commandname)
                    commandInfo.setDescription(desc)
                }else {
                    fullCommandList
                        .setDescription(`Could not find command "${command}"` + '\nuse `/help <command>` to get more info on a command')

                    return message.reply({ embeds: [fullCommandList], allowedMentions: { repliedUser: false } })
                }
                fullCommandList
                    .setDescription(`Could not find command "${command}"` + '\nuse `/help <command>` to get more info on a command')
                message.reply({ embeds: [commandInfo], allowedMentions: { repliedUser: false } })
            }
            fs.appendFileSync('commands.log', `\nCommand Information\n${message.content}`)
        }



        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - help (interaction)\n${currentDate} | ${currentDateISO}\n recieved help command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

            let command = interaction.options.getString('command')
            let commandInfo = new Discord.MessageEmbed()
                .setColor('#0099ff')
            if (client.commands.get(command)) {

                let commandname = client.commands.get(command).name
                let res = commandhelp.cmds.find(obj => obj.name == commandname)

                let desc = ''
                desc += res.description + "\n"
                if (res.usage) {
                    desc += `\nCommand: \`${res.usage}\``
                }
                if (res.slashusage) {
                    desc += `\nSlash Command: \`${res.slashusage}\``
                }

                let opts = res.options
                let opttxt = '';
                for (i = 0; i < opts.length; i++) {
                    opttxt += `\n⠀⠀\`${opts[i].name}\`: ${opts[i].description}`

                }
                desc += "\n\n" + opttxt

                if (res.aliases) {
                    desc += `\n\nAliases: ${res.aliases}`
                }

                commandInfo.setTitle("Command info for: " + commandname)
                commandInfo.setDescription(desc)

            } else if (client.osucmds.get(command)) {
                let commandname = client.osucmds.get(command).name
                let res = commandhelp.osucmds.find(obj => obj.name == commandname)

                let desc = ''
                desc += res.description + "\n"
                if (res.usage) {
                    desc += `\nCommand: \`${res.usage}\``
                }
                if (res.slashusage) {
                    desc += `\nSlash Command: \`${res.slashusage}\``
                }

                let opts = res.options
                let opttxt = '';
                for (i = 0; i < opts.length; i++) {
                    opttxt += `\n⠀⠀\`${opts[i].name}\`: ${opts[i].description}`

                }
                desc += "\n\n" + opttxt

                if (res.aliases) {
                    desc += `\n\nAliases: ${res.aliases}`
                }

                commandInfo.setTitle("Command info for: " + commandname)
                commandInfo.setDescription(desc)

            }
            else if (client.admincmds.get(command)) {

                let commandname = client.admincmds.get(command).name
                let res = commandhelp.admincmds.find(obj => obj.name == commandname)

                let desc = ''
                desc += res.description + "\n"
                if (res.usage) {
                    desc += `\nCommand: \`${res.usage}\``
                }
                if (res.slashusage) {
                    desc += `\nSlash Command: \`${res.slashusage}\``
                }

                let opts = res.options
                let opttxt = '';
                for (i = 0; i < opts.length; i++) {
                    opttxt += `\n⠀⠀\`${opts[i].name}\`: ${opts[i].description}`

                }
                desc += "\n\n" + opttxt

                if (res.aliases) {
                    desc += `\n\nAliases: ${res.aliases}`
                }

                commandInfo.setTitle("Command info for: " + commandname)
                commandInfo.setDescription(desc)

            } else if (client.links.get(command)) {

                commandInfo.setTitle(client.links.get(command).name)
                commandInfo.setDescription(client.links.get(command).description)
            }
            else {
                fullCommandList
                    .setDescription(`Could not find command "${command}"` + '\nuse `/help <command>` to get more info on a command')
                return interaction.reply({ embeds: [fullCommandList], allowedMentions: { repliedUser: false } })
            }
            interaction.reply({ embeds: [commandInfo], allowedMentions: { repliedUser: false } })
            fs.appendFileSync('commands.log', `\nCommand Information\nCommand: ${command}`)

        }

    }
}

/* module.exports = {
    name: 'help',
    description: 'Displays all commands\n' +
        'Command: `sbr-help`\n' +
        'Slash command: `/help [command]`\n' +
        'Options:\n' +
        '⠀⠀`command` - string, optional. The command to get help for. If omitted, all commands will be displayed.\n',
    execute(message, client, Discord, interaction, currentDate, currentDateISO, config) {

        let fullCommandList = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Command List')
            .setDescription('use `/help <command>` to get more info on a command')
            .addField('Main commands',
                `**ping** - Displays the bot's ping\n` +
                `**help** - Displays this message\n`
                , false)
            .addField('osu! commands',
                `**osu** \`[user (optional)]\`- displays a user's profile\n` +
                `**osuset** \`[user (required)] [mode (optional)]\` - sets your osu! username\n` +
                `**osutop** \`[user (optional)] [mode (optional)] [sort (optional)] [page (optional)] [mapper (optional)] [detailed (booleanoptional)]\` - displays the user's top plays\n` +
                `**map** \`[id (optional)] [mods (optional)]\` - displays the map info for a beatmap\n` +
                `**rs** \`[user (optional)] [mode (optional)] [offset (optional)]\`  - displays the most recent score for the user\n` +
                `[WIP]**scores** \`[user (optional)] [id (optional)] [sort (optional)]\` - displays the users scores for a given beatmap`
                , false)
            .addField('admin commands',
                '[WIP]**checkperms** \`[user (required)]\` - checks the permissions of a given user\n' +
                '[WIP]**leaveguild** \`[guild (required)]\` - leaves a given server\n' +
                '[WIP]**servers** - displays all servers the bot is in', false)
            .addField('other commands',
                '[WIP]**gif** \`[type (required)]\` - displays a gif of a given type\n' +
                '[WIP]**ytsearch** \`[query (required)]\` - searches youtube for a given query\n' +
                '[WIP]**imagesearch** \`[query (required)]\` - searches google images for a given query\n' +
                '[WIP]**remind** \`[reminder (required)] [time (required)]\` - creates a reminder\n' +
                '[WIP]**math** \`[expression (required)]\` - evaluates a math expression\n' +
                '[WIP]**convert** \`[value (required)] [from (required)] [to (required)]\` - converts a value from one unit to another\n', false
            )


        if (message != null) {
            message.reply({ embeds: [fullCommandList] })
        }



        if (interaction != null) {
            let command = interaction.options.getString('command')
            let commandInfo = new Discord.MessageEmbed()
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