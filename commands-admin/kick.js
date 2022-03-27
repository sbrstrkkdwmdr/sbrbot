const fs = require('fs')
module.exports = {
    name: 'kick',
    description: '',
    execute(message, args, client, Discord, currentDate, currentDateISO) {
        if(message.member.permissions.has('KICK_MEMBERS')){
            fs.appendFileSync('admincmd.log', "\n" + '--- COMMAND EXECUTION ---')
            fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync('admincmd.log', "\n" + "command executed - kick")
            fs.appendFileSync('admincmd.log', "\n" + "category - admin")
            let consoleloguserweeee = message.author
            fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        let user = message.mentions.users.first();
        if(user){
        let member = message.guild.members.cache.get(user.id)
        if(member){
        let reason = "idk"
        member
        .kick(`${reason}`)
        .then(() => {
            message.reply(`successfully kicked ${user.tag} | ${user.tag}`);
            fs.appendFileSync('admincmd.log', "\n" + `kicked user - ${user.id} ${user.tag}`)
            fs.appendFileSync('admincmd.log', "\n" + "")
        })
        .catch(err => {
            message.reply(`I am unable to kick ${user.tag}. cope harder.`);
            console.error(err)
        })
    } else { message.channel.send("That user is no longer here.")}
    } else { message.channel.send("No user has been mentioned")}
    fs.appendFileSync('admincmd.log', "\n" + "")
}   console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)