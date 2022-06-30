const fs = require('fs')
const fetch = require('node-fetch')
const yts = require('yt-search')
const cmdchecks = require('../configs/commandchecks.js')

module.exports = {
    name: 'ytsearch',
    description: 'null',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - ytsearch (message)\n${currentDate} | ${currentDateISO}\n recieved search youtube command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            if (!args.length) {
                return message.reply({ content: 'Please specify the video you want to search.', allowedMentions: { repliedUser: false } })
            }
            const searching = await yts.search(args.join(' '))
            if (searching.videos.length < 1) {
                return message.reply({ content: 'No results found', allowedMentions: { repliedUser: false } })
            }
            let vids = searching.videos
            let embed = new Discord.MessageEmbed()
                .setTitle(`Results for ${args.join(' ')}`)
                ;
            for (i = 0; i < 5 && i < vids.length; i++) {
                embed.addField(`#${i + 1}`,
                    `[${cmdchecks.shorten(vids[i].title)}](${vids[i].url})
                Published by [${vids[i].author.name}](${vids[i].author.url})
                ${vids[i].ago}
                Duration: ${vids[i].timestamp} (${vids[i].seconds}s)
                Description: \`${vids[i].description}\`
                `, false)
            }
            fs.writeFileSync('debug/ytsearch.json', JSON.stringify(searching, null, 2))
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
            fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)
        }
        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - ytsearch (interaction)\n${currentDate} | ${currentDateISO}\n recieved search youtube command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            let query = interaction.options.getString('query')
            if (!query) {
                return interaction.reply({ content: 'Please specify the video you want to search.', allowedMentions: { repliedUser: false } })
            }
            const searching = await yts.search(query)
            if (searching.videos.length < 1) {
                return interaction.reply({ content: 'No results found', allowedMentions: { repliedUser: false } })
            }
            let vids = searching.videos
            let embed = new Discord.MessageEmbed()
                .setTitle(`Results for ${query}`)
                ;
            for (i = 0; i < 5 && i < vids.length; i++) {
                embed.addField(`#${i + 1}`,
                    `[${cmdchecks.shorten(vids[i].title)}](${vids[i].url})
                Published by [${vids[i].author.name}](${vids[i].author.url})
                ${vids[i].ago}
                Duration: ${vids[i].timestamp} (${vids[i].seconds}s)
                Description: \`${vids[i].description}\`
                `, false)
            }
            fs.writeFileSync('debug/ytsearch.json', JSON.stringify(searching, null, 2))
            interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
            fs.appendFileSync('commands.log', `\nCommand Information\nquery: ${query}`)
        }
    }
}