const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: 'sayto',
    description: "say",
    execute(client, message, args, currentDate, currentDateISO) {
        if(message.author == 503794887318044675){
        try{const sendtochannelget = args[0];
        const sendtochannel = client.channels.cache.get(sendtochannelget)
        const saythis = args.splice(1,1000).join(" ");
        //message.delete();
        sendtochannel.send(saythis)
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - sayto")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + "")
        console.groupEnd() }
        catch(error){
            fs.appendFileSync(otherlogdir, "\n" + error)
        }
    }
        else return ;
    }
}