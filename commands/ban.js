module.exports = {
    name: 'ban',
    description: '',
    execute(message, args) {
        if(message.member.hasPermission('ADMINISTRATOR')){
        let user = message.mentions.users.first();
        if(user){
        let member = message.guild.member(user);
        if(member){
        let reaswon = args.slice(1).join(' ');
        member
            .ban({
            reason: `${reaswon}`,
        }
        )
        .then(() => {
            message.reply(`successfully banned ${user.tag} (AKA ${user.id})`);
        })
        .catch(err => {
            message.reply(`I am unable to ban ${user.tag}`);
            console.error(err)
        })
    } else { message.channel.send("That user is no longer here.")}
    } else { message.channel.send("No user has been mentioned")}
} else {
    message.channel.send("no. cope harder")
}
    }
}
//client.commands.get('').execute(message, args)