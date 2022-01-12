let currentDate = new Date();
let currentDateISO = new Date().toISOString();
module.exports = {
    name: 'musicnp',
    description: '',
    async execute(message, args, client, Player, player, Discord, ytdl) {
        message.reply("scroll up")

  console.log(`${currentDateISO} | ${currentDate}`)
  console.log("command executed - musicplay")
  let consoleloguserweeee = message.author
  console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
  console.log("")
}}