module.exports = {
    name: 'purge',
    description: 'ERADICATE',
    async execute(message, args) {
        if(message.author.id == '503794887318044675'){
        let user = message.mentions.users.first();
        if(!args[0]) return message.reply("integer needed");
        if(isNaN(args[0])) return message.reply("integer needed");

        if(args[0]>1000) return message.reply("that integer is too big lol (the limit is 1k)");
        if(args[0]<1) return message.reply("integer is too small");
        message.delete();
        await message.channel.messages.fetch({limit: args[0]}).then(messages =>{
            message.channel.bulkDelete(messages);
            console.log("command executed - purge")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log(`deleted message count - ${args[0]}`)
            console.log("")
        });
        }
        else{
            console.log("command executed - purge")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("command failed - insufficient perms")
            console.log("")
        }
    }
}