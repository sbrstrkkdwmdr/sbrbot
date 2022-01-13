const {Player} = require('discord-player');
module.exports = {
    name: 'musicstop',
    description: '',
    execute(message, args, client, Discord, ytdl, currentDate, currentDateISO) {
        const player = new Player(client);
console.log(`${currentDateISO} | ${currentDate}`)
console.log("executed command - musicstop")
let consoleloguserweeee = message.author
console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
console.log("")
}}