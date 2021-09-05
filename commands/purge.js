module.exports = {
    name: 'purge',
    description: 'ERADICATE',
    async execute(message, args) {
        if(message.member.hasPermission('ADMINISTRATOR')){
        let user = message.mentions.users.first();
        if(!args[0]) return message.reply("number");
        if(isNaN(args[0])) return message.reply("integer needed");

        if(args[0]>1000) return message.reply("woah big number");
        if(args[0]<1) return message.reply("not doable");
        message.delete();
        await message.channel.messages.fetch({limit: args[0]}).then(messages =>{
            message.channel.bulkDelete(messages);
        });
        }
        else{
        
        }
    }
}