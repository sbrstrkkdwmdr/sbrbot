module.exports = {
    name: 'serverlist',
    description: '',
    execute(message, args, Discord, client, guild) {
        let wee = client.guilds.cache.map(guild);
        message.channel.send(`${wee}`)
    }
}
//client.commands.get('').execute(message, args)