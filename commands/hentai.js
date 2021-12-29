module.exports = {
    name: 'hentai',
    execute(message, args, currentDate, currentDateISO) {
        if(message.channel.nsfw) {
        let pp = Math.floor(Math.random () * 70005 + 1)
        message.channel.send(`https://nhentai.net/g/${pp}`)
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - hentai")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log(`img id - ${pp}`)
        console.log("")
    }
        else {
            message.channel.send("this channel is not NSFW")
            console.log(`${currentDateISO} | ${currentDate}`)
            console.log("command executed - hentai")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("command failed - non NSFW channel")
            console.log("")
        }
    }
}