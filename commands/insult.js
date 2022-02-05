module.exports = {
    name: 'insult',
    description: 'insult',
    execute(message, args, currentDate, currentDateISO) {
        if(message.member.permissions.has('SEND_MESSAGES')){
            console.group('--- COMMAND EXECUTION ---')
            console.log(`${currentDateISO} | ${currentDate}`)
            console.log("command executed - insult")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("")
            console.groupEnd()
            let rdm = ["キモイ", "you're a 10... on the pH scale cuz ya basic!", "sharthead", "dumbface", "insert insult here, I'll think of one later"];
            let ins = rdm[Math.floor(Math.random() * rdm.length)];
            let user = message.mentions.users.first();
            if(!user){
                message.channel.send("a user needs to be mentioned")
            }
            else{
            message.channel.send(`${user} ${ins}`)
            message.delete();}
            }
            else{
                message.channel.send('command error?')
            } 
    }
}
//client.commands.get('').execute(message, args)