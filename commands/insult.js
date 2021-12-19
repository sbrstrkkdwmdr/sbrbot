module.exports = {
    name: 'insult',
    description: 'insult',
    execute(message, args, currentDate, currentDateISO) {
        if(message.member.permissions.has('SEND_MESSAGES')){
            console.log(`${currentDateISO} | ${currentDate}`)
            console.log("command executed - insult")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("")
            let user = message.mentions.users.first();
            if(!user){
                message.channel.send("a user needs to be mentioned")
            }
            else{
            message.channel.send(`${user}はキモいです。うんこ食べてくださいｗｗｗ`)
            message.delete();}
            }
            else{
                message.channel.send('command error?')
            } 
    }
}
//client.commands.get('').execute(message, args)