module.exports = {
    name: 'banid',
    description: '',
    execute(message, args) {
        if(message.member.hasPermission('ADMINISTRATOR')){
            let userID = args[0]
        let user = userID
        if(userID){
        let member = message.guild.member(userID);
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