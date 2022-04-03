const fs = require('fs')
const { adminlogdir } = require('../logconfig.json')

module.exports = {
    name: 'break時ｗｗｗワロト',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        if(message.member.permissions.has('ADMINISTRATOR')){
            fs.appendFileSync(adminlogdir, "\n" + '--- COMMAND EXECUTION ---')
            fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync(adminlogdir, "\n" + "command executed - break")
            fs.appendFileSync(adminlogdir, "\n" + "category - admin")
            let consoleloguserweeee = message.author
            fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync(adminlogdir, "\n" + "")
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