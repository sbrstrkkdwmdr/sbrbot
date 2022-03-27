const {Player} = require('discord-player');
const fs = require('fs')
module.exports = {
    name: 'musicqueue',
    description: '',
    async execute(message, args, client, Discord, ytdl, currentDate, currentDateISO) {
        fs.appendFileSync('checker.log', "\n" + '--- COMMAND EXECUTION ---')
        const player = new Player(client);
        const queue = player.createQueue(message.guild, {
            metadata: {
                channel: message.channel
            }
        });
    message.reply(queue)
fs.appendFileSync('checker.log', "\n" + `${currentDateISO} | ${currentDate}`)
fs.appendFileSync('checker.log', "\n" + "executed command - musicstop")
fs.appendFileSync('checker.log', "\n" + "category - music")
let consoleloguserweeee = message.author
fs.appendFileSync('checker.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
fs.appendFileSync('checker.log', "\n" + "")
console.groupEnd()
}}