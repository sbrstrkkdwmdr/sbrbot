const {Player} = require('discord-player');
const player = new Player(client);
module.exports = {
    name: 'musicstop',
    description: '',
    execute(message, args, client, Discord, ytdl, currentDate, currentDateISO) {
  
console.log(`${currentDateISO} | ${currentDate}`)
console.log("executed command - musicstop")
let consoleloguserweeee = message.author
console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
console.log("")
}}