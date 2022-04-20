const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: 'testingtypescript',
    description: 'insult',
    execute(message, args, currentDate, currentDateISO) {
        message.reply('yup it works')
    }
}
//client.commands.get('').execute(message, args)