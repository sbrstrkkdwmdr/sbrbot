module.exports = {
    name: 'yanderegen',
    execute(message, args) {
        if(message.channel.nsfw) {
        let pp = Math.floor(Math.random () * 100000000 + 1)
        message.channel.send(`https://yande.re/post/show/${pp}`)}
        else {
            message.channel.send("this channel is not NSFW")
        }
    }
}