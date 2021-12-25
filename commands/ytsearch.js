const yts = require('yt-search');

module.exports = {
    name: 'ytsearch',
    description: "Search on YouTube",
    async execute(message, args, client, Discord, currentDate, currentDateISO) {
        try{if(!args.length){message.reply('No search query given') //Checks if the user gave any search queries
    } else{
        const searched = await yts.search(args.splice(0,100).join(" ")); //Searches for videos
        message.reply(!searched.videos.length ? 'No Results' : searched.videos[0].url); //Sends the result
        }
    } catch (error){
        message.reply("error")
        console.log(error)
    }
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - yt search")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}