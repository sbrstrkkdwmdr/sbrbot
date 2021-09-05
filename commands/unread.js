module.exports = {
    name: 'unread',
    description: '',
    execute(message, args) {
        message.delete();
    }
}
//client.commands.get('').execute(message, args)