module.exports = {
    name: '8ball',
    description: '',
    execute(message, args) {
        let rdm = ["yes", "no clue.", "知らない", "nope", "yeah", "definitely maybe not", "nah", "yeah of course", "絶対!!!", "多分", 
        "i didn't quite catch that, ask again?", "ehhhhhhh", ""];
        let ball = rdm[Math.floor(Math.random() * rdm.length)];
        message.channel.send(`${ball}`)   
    }
}
//client.commands.get('').execute(message, args)