const fs = require('fs')
module.exports = {
    name: 'break時ｗｗｗワロト',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        if(message.member.permissions.has('ADMINISTRATOR')){
            fs.appendFileSync('admincmd.log', "\n" + '--- COMMAND EXECUTION ---')
            fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync('admincmd.log', "\n" + "command executed - break")
            fs.appendFileSync('admincmd.log', "\n" + "category - admin")
            let consoleloguserweeee = message.author
            fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync('admincmd.log', "\n" + "")
            console.groupEnd()
        message.channel.send('');   
        message.jkdfhskjfhsdkfhsdkf
        wekjlw
        ekjltwe
        w4otuwitywtewot8989
    }
    }
}
//client.commands.get('').execute(message, args)