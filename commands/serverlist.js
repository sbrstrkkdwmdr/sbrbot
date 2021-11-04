module.exports = {
    name: 'serverlist',
    description: '',
    execute(message, args, Discord, client) {
        client.guilds.cache.forEach(guild => {
            message.channel.send(`${guild.name} | ${guild.id}`);
          })
    }
}
//client.commands.get('').execute(message, args)