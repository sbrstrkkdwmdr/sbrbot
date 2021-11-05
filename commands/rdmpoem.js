module.exports = {
    name: 'rdm',
    description: '',
    execute(message, args) {
        let poem = ["pee", "poo", "fart"];
        message.channel.send(`${poem}`)   
    }
}
//client.commands.get('').execute(message, args)