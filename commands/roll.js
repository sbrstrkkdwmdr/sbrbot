module.exports = {
    name: 'roll',
    description: '',
    execute(message, args) {
        if(message.member.hasPermission('SEND_MESSAGES')){
            let user = message.author
            let score = Math.floor(Math.random () * 100 + 1) 
            message.channel.send(` ${user} has rolled a(n) ${score} `)
            if (score == 69){
                message.channel.send("funny number")
            }
            else if (score == 100){
                message.channel.send("SS")
            }
            } 
    }
}
//client.commands.get('').execute(message, args)