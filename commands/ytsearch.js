const yts = require('yt-search');

module.exports = {
    name: 'ytsearch',
    description: "Search on YouTube",
    async execute(message, args, client, Discord, currentDate, currentDateISO) {
        try{if(!args.length){message.reply('No search query given') //Checks if the user gave any search queries
    } else{
        const searched = await yts.search(args.splice(0,100).join(" ")); //Searches for videos
        if(!searched.videos.length){
            message.reply("no results found")
        } else {
        let creator1 = JSON.stringify(searched.videos[0].author, ['name']).replaceAll('name', '').replaceAll("{", "").replaceAll("}", "").replaceAll('"', "").replaceAll(":", "");
        let creator2 = JSON.stringify(searched.videos[1].author, ['name']).replaceAll('name', '').replaceAll("{", "").replaceAll("}", "").replaceAll('"', "").replaceAll(":", "");
        let creator3 = JSON.stringify(searched.videos[2].author, ['name']).replaceAll('name', '').replaceAll("{", "").replaceAll("}", "").replaceAll('"', "").replaceAll(":", "");
        let creator4 = JSON.stringify(searched.videos[3].author, ['name']).replaceAll('name', '').replaceAll("{", "").replaceAll("}", "").replaceAll('"', "").replaceAll(":", "");
        let creator5 = JSON.stringify(searched.videos[4].author, ['name']).replaceAll('name', '').replaceAll("{", "").replaceAll("}", "").replaceAll('"', "").replaceAll(":", "");
    message.reply(`${searched.videos[0].title} by ${creator1} | <${searched.videos[0].url}> \n${searched.videos[1].title} by ${creator2} | <${searched.videos[1].url}> \n${searched.videos[2].title} by ${creator3} | <${searched.videos[2].url}> \n${searched.videos[3].title} by ${creator4} | <${searched.videos[3].url}> \n${searched.videos[4].title} by ${creator5} | <${searched.videos[4].url}>`); //Sends the result
        //message.reply(`${searched.videos[0].title} by ${creator1} | ${searched.videos[0].url}`)//sends result
    } 
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