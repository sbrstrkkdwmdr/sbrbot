const fs = require('fs')
const yts = require('yt-search');

module.exports = {
    name: 'ytsearch',
    description: "Search on YouTube",
    async execute(message, args, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
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
    message.reply(`[1] ${searched.videos[0].title} by ${creator1} \nurl: <${searched.videos[0].url}> \n \n[2] ${searched.videos[1].title} by ${creator2} \nurl: <${searched.videos[1].url}> \n \n[3] ${searched.videos[2].title} by ${creator3} \nurl: <${searched.videos[2].url}> \n \n[4] ${searched.videos[3].title} by ${creator4} \nurl: <${searched.videos[3].url}> \n \n[5] ${searched.videos[4].title} by ${creator5} \nurl: <${searched.videos[4].url}>`); //Sends the result
        //message.reply(`${searched.videos[0].title} by ${creator1} | ${searched.videos[0].url}`)//sends result
    } 
        }
    } catch (error){
        message.reply("error")
        fs.appendFileSync('cmd.log', "\n" + error)
    }
        fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('cmd.log', "\n" + "command executed - yt search")
        fs.appendFileSync('cmd.log', "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('cmd.log', "\n" + "")
        console.groupEnd()
    }
}