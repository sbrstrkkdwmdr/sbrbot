const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: 'say',
    description: 
    'Says the args given' + 
    'Usage: `sbr-say [message]`',
    execute(owners, message, args, currentDate, currentDateISO) {
        if(!owners.some(v => (message.author.id.toString()).includes(v))){
            message.delete();
            return;
        };
        const saythis = args.splice(0,1000).join(" ");
        message.delete();
        message.channel.send(saythis)
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - say")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + "")
        console.groupEnd()
    }
}