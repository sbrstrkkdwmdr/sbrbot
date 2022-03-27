const fs = require('fs')
module.exports = {
    name: 'roll',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        if(message.member.permissions.has('SEND_MESSAGES')){
            fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
            let user = message.author
            let w = args.slice(0).join(' ')
            if(w > 0){
                let score = Math.floor(Math.random () * w + 1)
                message.channel.send(` ${user} has rolled a(n) ${score} `)
                fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
                fs.appendFileSync('cmd.log', "\n" + "command executed - roll")
                fs.appendFileSync('cmd.log', "\n" + "category - general")
                let consoleloguserweeee = message.author
                fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
                fs.appendFileSync('cmd.log', "\n" + "")
            }
            else{
            let score = Math.floor(Math.random () * 100 + 1)
            message.channel.send(` ${user} has rolled a(n) ${score} `)
            fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync('cmd.log', "\n" + "command executed - roll")
            fs.appendFileSync('cmd.log', "\n" + "category - general")
            let consoleloguserweeee = message.author
            fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync('cmd.log', "\n" + "")
            
            }
            console.groupEnd()
            } 
        }
}
//client.commands.get('').execute(message, args)