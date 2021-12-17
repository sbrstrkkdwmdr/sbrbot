module.exports = {
    name: 'unchi',
    description: '',
    execute(message, args, currentDate) {
        message.channel.send("ウンチ美味しい")   
        console.log(`${currentDate}`)
        console.log("command executed - unchi")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)