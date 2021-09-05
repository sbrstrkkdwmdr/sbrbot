module.exports = {
    name: 'test',
    description: '',
    execute(message, args) {
        message.channel.send("there's a test?")
    }
}
//client.commands.get('').execute(message, args)