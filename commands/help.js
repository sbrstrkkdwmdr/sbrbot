module.exports = {
    name: 'help',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        message.channel.send('commands listed here - https://sbrstrkkdwmdr.github.io/sbr-web/botcmd') 
        console.log(`${currentDateISO} | ${currentDate}`)  
        console.log("command executed - help")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)