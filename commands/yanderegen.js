module.exports = {
    name: 'yanderegen',
    execute(message, args, currentDate) {
        if(message.channel.nsfw) {
        let pp = Math.floor(Math.random () * 100000000 + 1)
        message.channel.send(`https://yande.re/post/show/${pp}`)
        console.log(`${currentDate}`)
        console.log("command executed - yanderegen")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log(`img id - ${pp }`)
        console.log("")
    }
        else {
            message.channel.send("this channel is not NSFW")
            console.log(`${currentDate}`)
            console.log("command executed - yanderegen")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("command failed - non NSFW channel")
            console.log("")
        }
    }
}