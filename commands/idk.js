module.exports = {
    name: 'idk',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        if(message.member.permissions.has('SEND_MESSAGES')){
            message.channel.send("well I don't know either.")
            console.log(`${currentDateISO} | ${currentDate}`)
            console.log("command executed - idk")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("")
        }
        else{
            message.channel.send("well I don't know either. do you?")
            console.log(`${currentDateISO} | ${currentDate}`)
            console.log("command executed - idk")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("")
        }   
    console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)