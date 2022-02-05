module.exports = {
    name: 'serverlist',
    description: '',
    execute(message, args, Discord, client, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        client.guilds.cache.forEach(guild => {
            message.channel.send(`${guild.name} | ${guild.id}`);
        })
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - serverlist")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)