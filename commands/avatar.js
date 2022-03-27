const { DiscordAPIError } = require("discord.js");
const fs = require('fs')
module.exports = {
    name: 'avatar',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO) {
        fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('cmd.log', "\n" + "command executed - avatar")
        fs.appendFileSync('cmd.log', "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('cmd.log', "\n" + `mentions - ${message.mentions.users.size}`)
        fs.appendFileSync('cmd.log', "\n" + "")
        console.groupEnd()
        if (!message.mentions.users.size) {
            message.channel.send('This command requires someone to be mentioned.');
            return;}
        else {
            let user = message.mentions.users.first();
            let avatarEmbed = new Discord.MessageEmbed()
            .setColor(0xFFC1EC)
            .setAuthor(user.username)
            .setImage(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=2048`);
            message.reply({ embeds: [avatarEmbed] });
        }
    }
}
//client.commands.get('').execute(message, args)