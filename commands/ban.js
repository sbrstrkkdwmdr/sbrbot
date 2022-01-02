module.exports = {
    name: 'ban',
    description: '',
    async execute(message, args, client, Discord, currentDate, currentDateISO) {
       
        if(message.member.permissions.has('ADMINISTRATOR')){
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
                await member.ban({
                    reason: reaswon,
                    
                })
                console.log(`banned ${user} AKA ${user.tag} for ${reaswon}`)
                console.log("")
                message.reply(`banned ${user} AKA ${user.tag} for ${reaswon}`)
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