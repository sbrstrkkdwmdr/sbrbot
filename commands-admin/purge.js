module.exports = {
    name: 'purge',
    description: 'ERADICATE',
    async execute(message, args, client, Discord, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        if(message.member.permissions.has('ADMINISTRATOR')){
                try {
            let delcount = args[0];
            console.log("command executed - purge")
            console.log("category - admin")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log(`deleted message count - ${delcount}`)
            console.log("")

            if(isNaN(delcount) || parseInt(delcount <= 0)){
                message.reply("Error: NaN or too low")
            }
            if(parseInt(delcount) > 100){ 
                message.reply("number too high")
            }
            await message.channel.bulkDelete(parseInt(delcount) + 1, true);
        } catch(error) {
            message.reply("error")
            console.log(error)
        }} else {
            message.reply("insufficient permissions")
            console.log("command executed - purge")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("command failed - insufficient permissions")
            console.log("")
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
            console.log(`${currentDateISO} | ${currentDate}`)
            console.log("command executed - purge")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log(`deleted message count - ${args[0]}`)
            console.log("")
        }
        else{
            console.log(`${currentDateISO} | ${currentDate}`)
            console.log("command executed - purge")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("command failed - insufficient perms")
            console.log("")
        }*/
        console.groupEnd()
    }
}