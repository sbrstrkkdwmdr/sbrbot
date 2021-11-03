module.exports = {
    name: 'lolibooru',
    execute(message, args) {
        if(message.channel.nsfw) {
        let pp = Math.floor(Math.random () * 100000000 + 1)
        message.channel.send(`https://lolibooru.moe/post/show/${pp}`)}
        else {
            message.channel.send("this channel is not NSFW")
        }
    }
}