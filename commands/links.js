module.exports = {
    name: 'links',
    description: 'links',
    execute(message, args, currentDate) {
        message.channel.send('here you go! https://sbrstrkkdwmdr.github.io/sbr-web/');  
        console.log(`${currentDate}`)
        console.log("command executed - links")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)