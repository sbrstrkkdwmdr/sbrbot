let currentDate = new Date();
let currentDateISO = new Date().toISOString();
module.exports = {
    name: 'musicqueue',
    description: '',
    async execute(message, args, client, Player, player, Discord, ytdl) {
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