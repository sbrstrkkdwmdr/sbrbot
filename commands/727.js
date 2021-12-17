module.exports = {
    name: '727',
    description: '',
    execute(message, args) {
        message.channel.send("あんたがそれを見た時")   
        console.log("command executed - 727")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)