const { DiscordAPIError } = require("discord.js");

module.exports = {
    name: 'amoggers',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO) {
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - amoggers")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log(`mentions - ${message.mentions.users.size}`)
        console.log("")

            let Embed = new Discord.MessageEmbed()
            .setColor(0xFFC1EC)
            .setTitle("amoggers")
            .setImage(`https://media.discordapp.net/attachments/724514625005158403/921733161229107210/amoggers.png`);
            message.channel.send(Embed);
    }
}
//client.commands.get('').execute(message, args)