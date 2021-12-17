module.exports = {
    name: 'help',
    description: '',
    execute(message, args, currentDate) {
        message.channel.send('commands listed here - https://sites.google.com/view/sbrbot/home') 
        console.log(`${currentDate}`)  
        console.log("command executed - help")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)