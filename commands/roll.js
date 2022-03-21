module.exports = {
    name: 'roll',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        if(message.member.permissions.has('SEND_MESSAGES')){
            console.group('--- COMMAND EXECUTION ---')
            let user = message.author
            let w = args.slice(0).join(' ')
            if(w > 0){
                let score = Math.floor(Math.random () * w + 1)
                message.channel.send(` ${user} has rolled a(n) ${score} `)
                console.log(`${currentDateISO} | ${currentDate}`)
                console.log("command executed - roll")
                console.log("category - general")
                let consoleloguserweeee = message.author
                console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
                console.log("")
            }
            else{
            let score = Math.floor(Math.random () * 100 + 1)
            message.channel.send(` ${user} has rolled a(n) ${score} `)
            console.log(`${currentDateISO} | ${currentDate}`)
            console.log("command executed - roll")
            console.log("category - general")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("")
            
            }
            console.groupEnd()
            } 
        }
}
//client.commands.get('').execute(message, args)