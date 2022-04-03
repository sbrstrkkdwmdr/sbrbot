const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: 'addmsg',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - add random message")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + "")
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