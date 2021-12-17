module.exports = {
    name: 'pingperson',
    description: '',
    execute(message, args) {
        if(message.member.hasPermission('ADMINISTRATOR')){ //they need admin
            let user = message.mentions.users.first(); //gets the pinged user's ID
            message.channel.send(`${user} `); //user.username is the pinged user
            message.delete();
            console.log("command executed - pingperson")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log(`pinged - ${user}`)
            console.log("")
            }
            else {message.channel.send("Error 401: Unauthorised")  
                    console.log("command executed - ")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("command failed - insufficent perms")
        console.log("")}
    }
}
//client.commands.get('').execute(message, args)