module.exports = {
    name: 'giveadmin',
    description: '',
    execute(message, args) {
        if(message.member.hasPermission("ADMINISTRATOR")){
            message.channel.send("bro u already have it...")
        }
        else{
        message.channel.send("haha no")
        }//if(user.ID = 503794887318044675){
        //roles.create        
        //let rName =("admin")
        //message.channel.send(`${rNew.ID}`)
        //} 
        console.log(`command executed - giveadmin`)
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)