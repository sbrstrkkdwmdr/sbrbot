module.exports = {
    name: 'ban',
    description: '',
    async execute(message, args, client, Discord, currentDate, currentDateISO) {
       
        if(message.member.permissions.has('BAN_MEMBERS')){
            console.log(`${currentDateISO} | ${currentDate}`)
            console.log("command executed - ban")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("")

        const user = message.mentions.members.first();
        const reaswon = args.splice(1, 100).join(' ');
        if (!reaswon){
        message.reply("Reason required")
        console.log("command failed - no reason")
        console.log("")};
        if(reaswon){
        if(user){
            const member = message.guild.members.cache.get(user.id)

            if(member){
                try{await member.ban({
                    reason: reaswon,
                    
                })
                .catch(err => {
                    message.reply(`I am unable to ban ${user}. cope harder`)
                })
                console.log(`banned ${user} AKA ${user.id} for ${reaswon}`)
                console.log("")
                message.reply(`banned ${user} AKA ${user.id} for ${reaswon}`)}
                catch(error){
                message.reply("error")
                console.log(error)
                console.log("")
                }
            } else {
                message.reply("User not found")
                console.log("command failed - no user")
                console.log("")
            }
        } else {
            message.reply("No user mentioned")
            console.log("command failed - no user")
            console.log("")
        }}
        
} else {
    message.channel.send("no. cope harder")
    console.log(`${currentDateISO} | ${currentDate}`)
    console.log("command executed - ban")
    let consoleloguserweeee = message.author
    console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
    console.log("command failed - insufficient perms")
    console.log("")
}
    }
}
//client.commands.get('').execute(message, args)