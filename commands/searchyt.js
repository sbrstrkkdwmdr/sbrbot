const yts = require('yt-search');

module.exports = {
    name: 'searchyt',
    aliases: ['yt'],
    description: "Search on YouTube",
    async execute(/*params*/) {
        if (!args.length) return message.reply('No search query given') //Checks if the user gave any search queries
        const searched = await yts.search(args.join(' ')); //Searches for videos
        message.reply(!searched.videos.length ? 'No Results' : searched.videos[0].url); //Sends the result
    }
}