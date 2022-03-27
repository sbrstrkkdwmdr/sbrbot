const fs = require('fs')
module.exports = {
    name: 'randommsg',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('cmd.log', "\n" + "command executed - random message")
        fs.appendFileSync('cmd.log', "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('cmd.log', "\n" + "")
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