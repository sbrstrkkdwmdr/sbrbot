const { DiscordAPIError } = require("discord.js");
const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: 'avatar',
    description:
        'Sends the avatar/pfp of the mentioned user' +
        '\nUsage: `sbr-avatar <@id>`' +
        '\nAliases: av, pfp',
    execute(message, args, Discord, currentDate, currentDateISO) {
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - avatar")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + `mentions - ${message.mentions.users.size}`)
        fs.appendFileSync(otherlogdir, "\n" + "")
        console.groupEnd()
        if (!message.mentions.users.size) {
            message.channel.send('This command requires someone to be mentioned.');
            return;
        }
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