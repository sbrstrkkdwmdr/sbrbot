module.exports = {
    name: 'token',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        if(message.member.permissions.has('ADMINISTRATOR')){
            message.channel.send("Admin should already know the bot token.")
        }
        else{
            message.channel.send("the bot token.")
        }
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - token")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)