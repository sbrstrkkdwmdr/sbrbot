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
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - sayto")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd() }
        catch(error){
            console.log(error)
        }
    }
        else return ;
    }
}