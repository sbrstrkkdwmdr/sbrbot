const { DiscordAPIError } = require("discord.js");

module.exports = {
    name: 'amoggers',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - amoggers")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()

            let Embed = new Discord.MessageEmbed()
            .setColor(0xFFC1EC)
            .setTitle("amoggers")
            .setImage(`https://media.discordapp.net/attachments/724514625005158403/921733161229107210/amoggers.png`);
            message.reply({ embeds: [Embed] });
    }
}
//client.commands.get('').execute(message, args)