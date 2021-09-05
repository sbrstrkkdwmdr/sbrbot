module.exports = {
    name: 'pingperson',
    description: '',
    execute(message, args) {
        if(message.member.hasPermission('ADMINISTRATOR')){ //they need admin
            let user = message.mentions.users.first(); //gets the pinged user's ID
            message.channel.send(`${user} `); //user.username is the pinged user
            message.delete();
            }
            else message.channel.send("Error 401: Unauthorised")  
    }
}
//client.commands.get('').execute(message, args)