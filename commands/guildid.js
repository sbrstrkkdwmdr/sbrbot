module.exports = {
    name: 'guildid',
    execute(message, args) {
        let we = message.guild.id
        message.channel.send(`${we}`)
        }
    }