const fs = require('fs')
module.exports = {
    name: 'addmsg',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - add random message")
        console.log("category - general")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
        fs.appendFileSync('randommessages.txt',  args.splice(0,1000).join(" ") + '\n')
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