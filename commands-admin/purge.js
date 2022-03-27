const fs = require('fs')
module.exports = {
    name: 'purge',
    description: 'ERADICATE',
    async execute(message, args, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync('admincmd.log', "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        if(message.member.permissions.has('ADMINISTRATOR')){
                try {
            let delcount = args[0];
            fs.appendFileSync('admincmd.log', "\n" + "command executed - purge")
            fs.appendFileSync('admincmd.log', "\n" + "category - admin")
            let consoleloguserweeee = message.author
            fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync('admincmd.log', "\n" + `deleted message count - ${delcount}`)
            fs.appendFileSync('admincmd.log', "\n" + "")

            if(isNaN(delcount) || parseInt(delcount <= 0)){
                message.reply("Error: NaN or too low")
            }
            if(parseInt(delcount) > 100){ 
                message.reply("number too high")
            }
            await message.channel.bulkDelete(parseInt(delcount) + 1, true);
        } catch(error) {
            message.reply("error")
            fs.appendFileSync('admincmd.log', "\n" + error)
        }} else {
            message.reply("insufficient permissions")
            fs.appendFileSync('admincmd.log', "\n" + "command executed - purge")
            let consoleloguserweeee = message.author
            fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync('admincmd.log', "\n" + "command failed - insufficient permissions")
            fs.appendFileSync('admincmd.log', "\n" + "")
        }
    
        /* OLD VER
        if(message.author.id == '503794887318044675'){
        let user = message.mentions.users.first();
        if(!args[0]) return message.reply("integer needed");
        if(isNaN(args[0])) return message.reply("integer needed");

        if(args[0]>1000) return message.reply("that integer is too big lol (the limit is 1k)");
        if(args[0]<1) return message.reply("integer is too small");
        message.delete();
        
        try {await message.channel.messages.fetch({limit: args[0]}).then(messages =>{
            message.channel.bulkDelete(messages);});} catch(err){
                message.reply("error")
            }
            fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync('admincmd.log', "\n" + "command executed - purge")
            let consoleloguserweeee = message.author
            fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync('admincmd.log', "\n" + `deleted message count - ${args[0]}`)
            fs.appendFileSync('admincmd.log', "\n" + "")
        }
        else{
            fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync('admincmd.log', "\n" + "command executed - purge")
            let consoleloguserweeee = message.author
            fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync('admincmd.log', "\n" + "command failed - insufficient perms")
            fs.appendFileSync('admincmd.log', "\n" + "")
        }*/
        console.groupEnd()
    }
}