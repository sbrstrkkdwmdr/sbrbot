const { DiscordAPIError } = require("discord.js");

module.exports = {
    name: 'avatar',
    description: '',
    execute(message, args, Discord) {
        if (!message.mentions.users.size) {
            message.channel.send('Nobody was mentioned');
            return;}
        else {
            let user = message.mentions.users.first();
            let avatarEmbed = new Discord.MessageEmbed()
            .setColor(0xFFC1EC)
            .setAuthor(user.username)
            .setImage(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=2048`);
            message.channel.send(avatarEmbed);
        }
    }
}
//client.commands.get('').execute(message, args)