const fs = require('fs')
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
        fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('cmd.log', "\n" + "command executed - sayto")
        fs.appendFileSync('cmd.log', "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('cmd.log', "\n" + "")
        console.groupEnd() }
        catch(error){
            fs.appendFileSync('cmd.log', "\n" + error)
        }
    }
        else return ;
    }
}