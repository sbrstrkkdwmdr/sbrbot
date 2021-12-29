const { DiscordAPIError } = require("discord.js");

module.exports = {
    name: 'avatar',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO) {
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - avatar")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log(`mentions - ${message.mentions.users.size}`)
        console.log("")
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