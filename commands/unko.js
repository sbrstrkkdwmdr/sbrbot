let currentDate = new Date();
let currentDateISO = new Date().toISOString();
module.exports = {
    name: 'unko',
    description: '',
    execute(message, args) {
        message.channel.send("ウンコご飯食べたい")   
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - unko")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)