let currentDate = new Date();
let currentDateISO = new Date().toISOString();
module.exports = {
    name: 'serverlist',
    description: '',
    execute(message, args, Discord, client) {
        client.guilds.cache.forEach(guild => {
            message.channel.send(`${guild.name} | ${guild.id}`);
          })
          console.log(`${currentDateISO} | ${currentDate}`)
          console.log("command executed - serverlist")
          let consoleloguserweeee = message.author
          console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
          console.log("")
    }
}
//client.commands.get('').execute(message, args)