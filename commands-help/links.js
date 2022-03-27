module.exports = {
    name: 'links',
    description: 'links',
    execute(message, args, currentDate, currentDateISO) {
        fs.appendFileSync('help.log', "\n" + '--- COMMAND EXECUTION ---')
        message.channel.send('here you go! https://sbrstrkkdwmdr.github.io/sbr-web/');  
        fs.appendFileSync('help.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('help.log', "\n" + "command executed - links")
        fs.appendFileSync('help.log', "\n" + "category - help")
        let consoleloguserweeee = message.author
        fs.appendFileSync('help.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('help.log', "\n" + "")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)