const {Player} = require('discord-player');
const fs = require('fs')
module.exports = {
    name: 'musicskip',
    description: 'WIP',
    execute(message, args, client, Discord, ytdl, currentDate, currentDateISO) {
        fs.appendFileSync('checker.log', "\n" + '--- COMMAND EXECUTION ---')
        const player = new Player(client);
fs.appendFileSync('checker.log', "\n" + `${currentDateISO} | ${currentDate}`)
fs.appendFileSync('checker.log', "\n" + "command executed - musicskip")
fs.appendFileSync('checker.log', "\n" + "category - music")
let consoleloguserweeee = message.author
fs.appendFileSync('checker.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
fs.appendFileSync('checker.log', "\n" + "")
console.groupEnd()
}}