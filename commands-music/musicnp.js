const {Player} = require('discord-player');
module.exports = {
    name: 'musicnp',
    description: '',
    async execute(message, args, client, Discord, ytdl, currentDate, currentDateISO) {
      console.group('--- COMMAND EXECUTION ---')
      const player = new Player(client);
      message.reply("scroll up")

    console.log(`${currentDateISO} | ${currentDate}`)
    console.log("command executed - musicplay")
    console.log("category - music")
    let consoleloguserweeee = message.author
    console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
    console.log("")
    console.groupEnd()
}}