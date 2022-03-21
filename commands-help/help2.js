module.exports = {
    name: 'help2',
    description: '',
    execute(interaction, options, Discord, commands, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        let helper = options.getString('command')
        if(!helper){
        helper = 'aaaaaaaaaaaaaaaaaaaaaaaa'
        }

        //client.commands.get('').execute(message, args)

        switch(helper){
            case 'math':
                interaction.reply('Calculates a simple math equation\nUsage: `/math add 2 4`')
                break;
            case 'convert':
                interaction.reply('Converts units into other units\nUsage: `/convert k>c 273.15`')
                break;
            case 'ping':
                interaction.reply('Sends a ping to the bot and API.\nUsage: `/ping`')
                break;
            //osu
            case 'rs':
                Embed = new Discord.MessageEmbed()
                    .setTitle('rs')
                    .setDescription('Returns the most recent osu! play for the user.\nUsage: `/rs saberstrike`')
                    .addField('options', 'user: required. username or ID of player\noffset: page offset. default 0\nmode: what gamemode. default osu! standard', false)
                interaction.reply({ embeds: [Embed]})
                break;
            case 'osutop':
                Embed = new Discord.MessageEmbed()
                    .setTitle('osutop')
                    .setDescription('Returns the top 5 osu! plays for the user\nUsage: `/osutop saberstrike`')
                    .addField('options', 'user: required. username or ID of player\noffset: page offset. default 0\nmode: what gamemode. default osu! standard', false)
                interaction.reply({ embeds: [Embed]})
                break;
            case 'skin':
                interaction.reply('skin.\nUsage: `/skin` or `/skin 10`')
                break;
            case 'map':
                Embed = new Discord.MessageEmbed()
                    .setTitle('map')
                    .setDescription('Returns information for the map\nUsage: `/map 3217235`')
                    .addField('options', 'id: map id. default last map requested\nmods: mods to apply to difficulty calculations. default NM (none)', false)
                interaction.reply({ embeds: [Embed]})
                break;
            case 'osu':
                Embed = new Discord.MessageEmbed()
                    .setTitle('osu')
                    .setDescription('Returns information for the user\nUsage: `/osu SaberStrike`')
                    .addField('options', 'user: required. username or ID of player', false)
                interaction.reply({ embeds: [Embed]})
                break;
            case 'pp':
                Embed = new Discord.MessageEmbed()
                    .setTitle('pp')
                    .setDescription('Returns pp calculations for the map\nUsage: `/pp 3217235`')
                    .addField('options', 'id: map id. default last map requested\nmods: mods to apply to difficulty calculations. default NM (none)', false)
                interaction.reply({ embeds: [Embed]})
                break;
            case 'osubest':
                interaction.reply('Returns information for the top 5 plays of all time.')
                break;
            case 'osubestrs':
                interaction.reply('Returns information for the top 10 plays over the past 24h.')
                break;
            case 'aaaaaaaaaaaaaaaaaaaaaaaa':
                interaction.reply('commands listed here - https://sbrstrkkdwmdr.github.io/sbr-web/botcmdslash')
                break;
            default:
                interaction.reply(`command "${helper}" not found\ncommands listed here - https://sbrstrkkdwmdr.github.io/sbr-web/botcmdslash`)
                //interaction.editReply('commands listed here - https://sbrstrkkdwmdr.github.io/sbr-web/botcmdslash')
                break;
        }


        console.log(`${currentDateISO} | ${currentDate}`)  
        console.log("command executed - help")
        console.log("category - help")
        let consoleloguserweeee = interaction.member.user
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)