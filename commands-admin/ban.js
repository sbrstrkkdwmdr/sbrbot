const fs = require('fs')
module.exports = {
    name: 'ban',
    description: '',
    async execute(message, args, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync('admincmd.log', "\n" + '--- COMMAND EXECUTION ---')
        if(message.member.permissions.has('BAN_MEMBERS')){
            fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync('admincmd.log', "\n" + "command executed - ban")
            fs.appendFileSync('admincmd.log', "\n" + "category - admin")
            let consoleloguserweeee = message.author
            fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync('admincmd.log', "\n" + "")

        const user = message.mentions.members.first();
        const reaswon = args.splice(1, 100).join(' ');
        if (!reaswon){
        message.reply("Reason required")
        fs.appendFileSync('admincmd.log', "\n" + "command failed - no reason")
        fs.appendFileSync('admincmd.log', "\n" + "")};
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
                fs.appendFileSync('admincmd.log', "\n" + `banned ${user} AKA ${user.id} for ${reaswon}`)
                fs.appendFileSync('admincmd.log', "\n" + "")
                message.reply(`banned ${user} AKA ${user.id} for ${reaswon}`)}
                catch(error){
                message.reply("error")
                fs.appendFileSync('admincmd.log', "\n" + error)
                fs.appendFileSync('admincmd.log', "\n" + "")
                }
            } else {
                message.reply("User not found")
                fs.appendFileSync('admincmd.log', "\n" + "command failed - no user")
                fs.appendFileSync('admincmd.log', "\n" + "")
            }
        } else {
            message.reply("No user mentioned")
            fs.appendFileSync('admincmd.log', "\n" + "command failed - no user")
            fs.appendFileSync('admincmd.log', "\n" + "")
        }}
        
} else {
    message.channel.send("no. cope harder")
    fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
    fs.appendFileSync('admincmd.log', "\n" + "command executed - ban")
    let consoleloguserweeee = message.author
    fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
    fs.appendFileSync('admincmd.log', "\n" + "command failed - insufficient perms")
    fs.appendFileSync('admincmd.log', "\n" + "")
}   console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)