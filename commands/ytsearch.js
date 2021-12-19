const yts = require('yt-search');

module.exports = {
    name: 'searchyt',
    aliases: ['yt'],
    description: "Search on YouTube",
    async execute(message, args, client, Discord, currentDate, currentDateISO) {
        if (!args.length) return message.reply('No search query given') //Checks if the user gave any search queries
        const searched = await yts.search(args.join(' ')); //Searches for videos
        message.reply(!searched.videos.length ? 'No Results' : searched.videos[0].url); //Sends the result
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - yt search")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}