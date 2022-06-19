module.exports = {
    name: 'help',
    description: 'Displays all commands',
    execute(message, client, Discord, interaction, currentDate, currentDateISO, config) {

        let fullCommandList = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Command List')
            .addField('Main commands',
                `**ping** - Displays the bot's ping\n` +
                `**help** - Displays this message\n`
                , false)
            .addField('osu! commands',
                `**osu** \`[user (integer/string, optional)]\`- displays a user's profile\n` +
                `**osuset** \`[user (integer/string, required)] [mode (string, optional)]\` - sets your osu! username\n` +
                `**osutop** \`[user (integer/string, optional)] [mode (string, optional)] [sort (string, optional)] [page (integer, optional)] [mapper (string, optional)] [detailed (boolean, optional)]\` - displays the user's top plays\n` +
                `**map** \`[id (integer, optional)] [mods (string, optional)]\` - displays the map info for a beatmap\n` +
                `**rs** \`[user (integer/string, optional)] [mode (string, optional)] [offset (integer, optional)]\`  - displays the most recent score for the user\n` +
                `**scores** \`[user (integer/string, optional)] [id (integer, optional)] [sort (string, optional)]\` - displays the users scores for a given beatmap`
                , false)
            .addField('admin commands',
                '**checkperms** \`[user (user, required)]\` - checks the permissions of a given user\n' +
                '**leaveguild** \`[guild (integer, required)]\` - leaves a given server\n' +
                '**servers** - displays all servers the bot is in', false)
            .addField('other commands',
                '**gif** \`[type (string, required)]\` - displays a gif of a given type\n' +
                '**ytsearch** \`[query (string, required)]\` - searches youtube for a given query\n' +
                '**imagesearch** \`[query (string, required)]\` - searches google images for a given query\n' +
                '**remind** \`[reminder (string, required)] [time (string, required)]\` - creates a reminder\n' +
                '**math** \`[expression (string, required)]\` - evaluates a math expression\n' +
                '**convert** \`[value (string, required)] [from (string, required)] [to (string, required)]\` - converts a value from one unit to another\n', false
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