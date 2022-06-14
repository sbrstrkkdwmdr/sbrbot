const fs = require('fs')
const { adminlogdir } = require('../logconfig.json')
module.exports = {
    name: 'purge',
    description: 'Deletes the specified amount of messages' + 
    '\nUsage: `sbr-purge [number<100]`',
    async execute(message, args, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync(adminlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        if(message.member.permissions.has('ADMINISTRATOR')){
                try {
            let delcount = args[0];
            fs.appendFileSync(adminlogdir, "\n" + "command executed - purge")
            fs.appendFileSync(adminlogdir, "\n" + "category - admin")
            let consoleloguserweeee = message.author
            fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync(adminlogdir, "\n" + `deleted message count - ${delcount}`)
            fs.appendFileSync(adminlogdir, "\n" + "")

            if(isNaN(delcount) || parseInt(delcount <= 0)){
                message.reply("Error: NaN or too low")
            }
            if(parseInt(delcount) > 100){ 
                message.reply("number too high")
            }
            await message.channel.bulkDelete(parseInt(delcount) + 1, true);
        } catch(error) {
            message.reply("error")
            fs.appendFileSync(adminlogdir, "\n" + error)
        }} else {
            message.reply("insufficient permissions")
            fs.appendFileSync(adminlogdir, "\n" + "command executed - purge")
            let consoleloguserweeee = message.author
            fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync(adminlogdir, "\n" + "command failed - insufficient permissions")
            fs.appendFileSync(adminlogdir, "\n" + "")
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
            fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync(adminlogdir, "\n" + "command executed - purge")
            let consoleloguserweeee = message.author
            fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync(adminlogdir, "\n" + `deleted message count - ${args[0]}`)
            fs.appendFileSync(adminlogdir, "\n" + "")
        }
        else{
            fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync(adminlogdir, "\n" + "command executed - purge")
            let consoleloguserweeee = message.author
            fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync(adminlogdir, "\n" + "command failed - insufficient perms")
            fs.appendFileSync(adminlogdir, "\n" + "")
        }*/
        console.groupEnd()
    }
}