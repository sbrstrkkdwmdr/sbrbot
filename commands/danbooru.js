module.exports = {
    name: 'danbooru',
    execute(message, args) {
        if(message.channel.nsfw) {
        let pp = Math.floor(Math.random () * 70005 + 1)
        message.channel.send(`https://danbooru.donmai.us/posts/${pp}`)}
        else {
            message.channel.send("this channel is not NSFW")
        }
    }
}