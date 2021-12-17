module.exports = {
    name: 'danbooru',
    execute(message, args, currentDate) {
        if(message.channel.nsfw) {
        let pp = Math.floor(Math.random () * 100000000 + 1)
        message.channel.send(`https://danbooru.donmai.us/posts/${pp}`)
        console.log(`${currentDate}`)
        console.log("command executed - ")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log(`img id - ${pp}`)
        console.log("")
    }
        else {
            message.channel.send("this channel is not NSFW")
            console.log(`${currentDate}`)
            console.log("command executed - danbooru")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("command failed - non NSFW channel")
            console.log("")
        }
    }
}