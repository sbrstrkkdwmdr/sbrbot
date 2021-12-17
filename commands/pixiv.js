module.exports = {
    name: 'pixiv',
    execute(message, args) {
        if(message.channel.nsfw) {
        let pp = Math.floor(Math.random () * 100000000 + 1) //90,000,000
        message.channel.send(`https://www.pixiv.net/en/artworks/${pp}`)
        console.log("command executed - ")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log(`img id - ${pp}`)
        console.log("")}
        else {
            message.channel.send("this channel is not NSFW")
            console.log("command executed - pixiv")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("command failed - not NSFW channel")
            console.log("")
        }
    }
}