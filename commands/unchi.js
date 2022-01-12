let currentDate = new Date();
let currentDateISO = new Date().toISOString();
module.exports = {
    name: 'unchi',
    description: '',
    execute(message, args) {
        message.channel.send("ウンチ美味しい")   
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - unchi")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)