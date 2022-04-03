const fs = require('fs')
const { adminlogdir } = require('../logconfig.json')

module.exports = {
    name: 'ban',
    description: '',
    async execute(message, args, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync(adminlogdir, "\n" + '--- COMMAND EXECUTION ---')
        if(message.member.permissions.has('BAN_MEMBERS')){
            fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync(adminlogdir, "\n" + "command executed - ban")
            fs.appendFileSync(adminlogdir, "\n" + "category - admin")
            let consoleloguserweeee = message.author
            fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync(adminlogdir, "\n" + "")

        const user = message.mentions.members.first();
        const reaswon = args.splice(1, 100).join(' ');
        if (!reaswon){
        message.reply("Reason required")
        fs.appendFileSync(adminlogdir, "\n" + "command failed - no reason")
        fs.appendFileSync(adminlogdir, "\n" + "")};
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
                fs.appendFileSync(adminlogdir, "\n" + `banned ${user} AKA ${user.id} for ${reaswon}`)
                fs.appendFileSync(adminlogdir, "\n" + "")
                message.reply(`banned ${user} AKA ${user.id} for ${reaswon}`)}
                catch(error){
                message.reply("error")
                fs.appendFileSync(adminlogdir, "\n" + error)
                fs.appendFileSync(adminlogdir, "\n" + "")
                }
            } else {
                message.reply("User not found")
                fs.appendFileSync(adminlogdir, "\n" + "command failed - no user")
                fs.appendFileSync(adminlogdir, "\n" + "")
            }
        } else {
            message.reply("No user mentioned")
            fs.appendFileSync(adminlogdir, "\n" + "command failed - no user")
            fs.appendFileSync(adminlogdir, "\n" + "")
        }}
        
} else {
    message.channel.send("no. cope harder")
    fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
    fs.appendFileSync(adminlogdir, "\n" + "command executed - ban")
    let consoleloguserweeee = message.author
    fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
    fs.appendFileSync(adminlogdir, "\n" + "command failed - insufficient perms")
    fs.appendFileSync(adminlogdir, "\n" + "")
}   console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)