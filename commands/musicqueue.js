const {Player} = require('discord-player');
const player = new Player(client);
module.exports = {
    name: 'musicqueue',
    description: '',
    async execute(message, args, client, Discord, ytdl, currentDate, currentDateISO) {
        const player = new Player(client);
        const queue = player.createQueue(message.guild, {
            metadata: {
                channel: message.channel
            }
        });
    message.reply(queue)
console.log(`${currentDateISO} | ${currentDate}`)
console.log("executed command - musicstop")
let consoleloguserweeee = message.author
console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
console.log("")
}}