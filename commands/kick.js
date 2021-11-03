module.exports = {
    name: 'kick',
    description: '',
    execute(message, args, Discord) {
        let user = message.mentions.users.first();
        if(user){
        let member = message.guild.member(user);
        if(member){
        let reason = "idk"
        member
        .kick(`${reason}`)
        .then(() => {
            message.reply(`successfully kicked ${user.tag}`);
        })
        .catch(err => {
            message.reply(`I am unable to kick ${user.tag}`);
            console.error(err)
        })
    } else { message.channel.send("That user is no longer here.")}
    } else { message.channel.send("No user has been mentioned")}
    }
}
//client.commands.get('').execute(message, args)