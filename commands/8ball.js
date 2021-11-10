module.exports = {
    name: '8ball',
    description: '',
    execute(message, args) {
        let rdm = ["yes", "no clue.", "知らない", "nope", "yeah", "definitely maybe not", "nah", "yeah of course", "絶対!!!", "多分", 
        "i didn't quite catch that, ask again?", "ehhhhhhh", ""];
        message.channel.send(`${rdm}`)   
    }
}
//client.commands.get('').execute(message, args)