module.exports = {
    name: 'giveadmin',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        if(message.member.permissions.has("ADMINISTRATOR")){
            message.channel.send("bro u already have it...")
        }
        else{
        message.channel.send("haha no")
        }//if(user.ID = 503794887318044675){
        //roles.create        
        //let rName =("admin")
        //message.channel.send(`${rNew.ID}`)
        //} 
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log(`command executed - giveadmin`)
        console.log("category - general")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)