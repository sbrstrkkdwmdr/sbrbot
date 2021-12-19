module.exports = {
    name: 'kick',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO) {
        if(message.member.hasPermission('ADMINISTRATOR')){
            console.log(`${currentDateISO} | ${currentDate}`)
            console.log("command executed - kick")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        let user = message.mentions.users.first();
        if(user){
        let member = message.guild.member(user);
        if(member){
        let reason = "idk"
        member
        .kick(`${reason}`)
        .then(() => {
            message.reply(`successfully kicked ${user.tag}`);
            console.log(`kicked user - ${user.id} ${user.tag}`)
            console.log("")
        })
        .catch(err => {
            message.reply(`I am unable to kick ${user.tag}`);
            console.error(err)
        })
    } else { message.channel.send("That user is no longer here.")}
    } else { message.channel.send("No user has been mentioned")}
    console.log("")
}
    }
}
//client.commands.get('').execute(message, args)