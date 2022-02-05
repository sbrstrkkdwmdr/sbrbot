module.exports = {
    name: 'kick',
    description: '',
    execute(message, args, client, Discord, currentDate, currentDateISO) {
        if(message.member.permissions.has('KICK_MEMBERS')){
            console.group('--- COMMAND EXECUTION ---')
            console.log(`${currentDateISO} | ${currentDate}`)
            console.log("command executed - kick")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        let user = message.mentions.users.first();
        if(user){
        let member = message.guild.members.cache.get(user.id)
        if(member){
        let reason = "idk"
        member
        .kick(`${reason}`)
        .then(() => {
            message.reply(`successfully kicked ${user.tag} | ${user.tag}`);
            console.log(`kicked user - ${user.id} ${user.tag}`)
            console.log("")
        })
        .catch(err => {
            message.reply(`I am unable to kick ${user.tag}. cope harder.`);
            console.error(err)
        })
    } else { message.channel.send("That user is no longer here.")}
    } else { message.channel.send("No user has been mentioned")}
    console.log("")
}   console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)