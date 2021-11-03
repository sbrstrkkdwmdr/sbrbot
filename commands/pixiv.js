module.exports = {
    name: 'pixiv',
    execute(message, args) {
        if(message.channel.nsfw) {
        let pp = Math.floor(Math.random () * 70005 + 1)
        message.channel.send(`https://www.pixiv.net/en/artworks/${pp}`)}
        else {
            message.channel.send("this channel is not NSFW")
        }
    }
}