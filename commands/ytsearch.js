const fs = require('fs')
const yts = require('yt-search');
const { otherlogdir } = require('../logconfig.json')

module.exports = {
    name: 'ytsearch',
    description:
        'Uses the YouTube api to return a youtube search' +
        'Usage: `sbr-ytsearch [query]`',
    async execute(message, args, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        try {
            if (!args.length) {
                message.reply('No search query given') //Checks if the user gave any search queries
            } else {
                const searched = await yts.search(args.splice(0, 100).join(" ")); //Searches for videos
                if (!searched.videos.length) {
                    message.reply("no results found")
                } else {
                    /*
                        let creator1 = JSON.stringify(searched.videos[0].author, ['name']).replaceAll('name', '').replaceAll("{", "").replaceAll("}", "").replaceAll('"', "").replaceAll(":", "");
                        let creator2 = JSON.stringify(searched.videos[1].author, ['name']).replaceAll('name', '').replaceAll("{", "").replaceAll("}", "").replaceAll('"', "").replaceAll(":", "");
                        let creator3 = JSON.stringify(searched.videos[2].author, ['name']).replaceAll('name', '').replaceAll("{", "").replaceAll("}", "").replaceAll('"', "").replaceAll(":", "");
                        let creator4 = JSON.stringify(searched.videos[3].author, ['name']).replaceAll('name', '').replaceAll("{", "").replaceAll("}", "").replaceAll('"', "").replaceAll(":", "");
                        let creator5 = JSON.stringify(searched.videos[4].author, ['name']).replaceAll('name', '').replaceAll("{", "").replaceAll("}", "").replaceAll('"', "").replaceAll(":", "");
                        message.reply(`[1] ${searched.videos[0].title} by ${creator1} \nurl: <${searched.videos[0].url}> \n \n[2] ${searched.videos[1].title} by ${creator2} \nurl: <${searched.videos[1].url}> \n \n[3] ${searched.videos[2].title} by ${creator3} \nurl: <${searched.videos[2].url}> \n \n[4] ${searched.videos[3].title} by ${creator4} \nurl: <${searched.videos[3].url}> \n \n[5] ${searched.videos[4].title} by ${creator5} \nurl: <${searched.videos[4].url}>`); //Sends the result
                        //message.reply(`${searched.videos[0].title} by ${creator1} | ${searched.videos[0].url}`)//sends result
                    */
                    let searchvid = searched.videos

                    let embed = new Discord.MessageEmbed()
                        .setTitle('Results for' + args.splice().join(" "))
                        //.setTitle('')
                        ;
                    let curtxt = ''
                    for (i = 0; i < 5 && i < searchvid.length; i++) {
                        let creator = searchvid[i].author.name
                        let title = shorten(searchvid[i].title)
                        let url = searchvid[i].url
                        let creatorurl = searchvid[i].author.url
                        let date = searchvid[i].ago
                        let length = searchvid[i].timestamp
                        let description = descshorten(searchvid[i].description)

                        curtxt +=
                            `**${i + 1} | [${title}](${url})**` +
                            `\nPublished by [${creator}](${creatorurl})` +
                            `\n${date}` +
                            `\nDuration: ${length}  (${searchvid[i].seconds}s)` +
                            `\nVideo Description: \`${description}\`` + 
                            `\n\n`
                    }
                    if (curtxt == '') {
                        curtxt = 'Error: no results'
                    }
                    embed.setDescription(curtxt)
                    //console.log(searchvid)
                    message.reply({ embeds: [embed] })
                    function shorten(txt) {
                        if (txt.length > 65) {
                            newtxt = txt.substring(0, 64) + '...'
                        } else {
                            newtxt = txt
                        }

                        return newtxt
                    }
                    function descshorten(txt) {
                        if (txt.length > 100) {
                            newtxt = txt.substring(0, 99) + '...'
                        } else {
                            newtxt = txt
                        }

                        return newtxt
                    }
                }
            }
        } catch (error) {
            message.reply("error")
            fs.appendFileSync(otherlogdir, "\n" + error)
        }
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - yt search")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + "")
        console.groupEnd()
    }
}