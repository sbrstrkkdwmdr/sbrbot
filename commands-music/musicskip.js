const {Player} = require('discord-player');
module.exports = {
    name: 'musicskip',
    description: '',
    execute(message, args, client, Discord, ytdl, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        const player = new Player(client);
console.log(`${currentDateISO} | ${currentDate}`)
console.log("command executed - musicskip")
console.log("category - music")
let consoleloguserweeee = message.author
console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
console.log("")
console.groupEnd()
}}