module.exports = {
    name: 'konachangen',
    execute(message, args) {
        if(message.channel.nsfw) {
        let pp = Math.floor(Math.random () * 100000000 + 1)
        message.channel.send(`https://konachan.com/post/show/${pp}`)
        console.log("command executed - konachangen")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log(`img id - ${pp}`)
        console.log("")
console.log("")}
        else {
            message.channel.send("this channel is not NSFW")
            console.log("command executed - konachangen")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log(`failed - non NSFW channel`)
    console.log("")
        }
    }
}