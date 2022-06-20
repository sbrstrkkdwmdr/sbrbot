module.exports = {
    name: 'help',
    description: 'Displays all commands',
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
            if (client.commands.get(command)) {
                let commandInfo = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(client.commands.get(command).name)
                    .setDescription(client.commands.get(command).description)
                interaction.reply({ embeds: [commandInfo] })
            } else if (client.osucmds.get(command)) {
                let commandInfo = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(client.osucmds.get(command).name)
                    .setDescription(client.osucmds.get(command).description)
                interaction.reply({ embeds: [commandInfo] })
            }
            else if (client.admincmds.get(command)) {
                let commandInfo = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(client.admincmds.get(command).name)
                    .setDescription(client.admincmds.get(command).description)
                interaction.reply({ embeds: [commandInfo] })
            } else if (client.links.get(command)) {
                let commandInfo = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(client.links.get(command).name)
                    .setDescription(client.links.get(command).description)
                interaction.reply({ embeds: [commandInfo] })
            }
            else {
                interaction.reply({ embeds: [fullCommandList] })
            }
        }

    }
}