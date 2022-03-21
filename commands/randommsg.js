const fs = require('fs')
module.exports = {
    name: 'randommsg',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - random message")
        console.log("category - general")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
        fs.readFile('randommessages.txt', function(error, msgarray) {
            if(error) throw error;
        
            const arr = msgarray.toString().replace(/\r\n/g,'\n').split('\n');
            let msg = arr[Math.floor(Math.random() * arr.length)];
            message.channel.send(msg)
        });
        /* if(args[0]){
            fs.readFile('randommessages.txt', function(error, msgarray) {
                if(error) throw error;
            
                const arr = msgarray.toString().replace(/\r\n/g,'\n').split('\n');
                const arguments = args[0]
                const w = arguments.find(v => (arr.includes(v)));
                if(w){
                    message.channel.send(w)
                }
                else{
                let msg = arr[Math.floor(Math.random() * arr.length)];
                message.channel.send(msg)}
            }); 
        }*/
    }
}
//client.commands.get('').execute(message, args)