module.exports = {
    name: 'osuhow',
    description: '',
    execute(message, args) {
        message.channel.send(":osuHOW:")
        message.delete();
    }
}
//client.commands.get('').execute(message, args)