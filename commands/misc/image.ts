import fs = require('fs')
import fetch from 'node-fetch'

module.exports = {
    name: 'image',
    description: 'null',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - image (message)\n${currentDate} | ${currentDateISO}\n recieved image command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')

            if (!args.length) {
                return message.reply({ content: 'Please specify the name of the image you want to search.', allowedMentions: { repliedUser: false } })
            }
            let res =
                await fetch(`https://customsearch.googleapis.com/customsearch/v1?q=${args.join(' ')}&cx=${config.google.cx}&key=${config.google.apiKey}&searchType=image`).catch(error => fs.appendFileSync(`commands.log`, "\n" + error));

            if (!res) return message.reply({ content: 'Unable to fetch the requested image.', allowedMentions: { repliedUser: false } })
            if (res.status >= 400) return message.reply({ content: `Error ${res.status}`, allowedMentions: { repliedUser: false } })

            let response = await res.json() as any;
            fs.writeFileSync('debug/image.json', JSON.stringify(response, null, 2))
            if (response.items.length < 1) return message.reply({ content: 'Error - no results found', allowedMentions: { repliedUser: false } })

            let resimg = ''
            let i: number;
            for (i = 0; i < 5 && i < response.items.length; i++) {
                resimg += `\n\n<${response.items[i].link}>`
            }
            let imageEmbed = new Discord.EmbedBuilder()
                .setTitle(`IMAGE RESULTS FOR ${args.join(' ')}`)
                .setDescription(`(NOTE - links may be unsafe)\n${resimg}`)
            let image1 = new Discord.EmbedBuilder()
                .setURL('https://www.google.com/search?q=' + args.join(' '))
                .setImage(`${response.items[0].image.thumbnailLink}`)
            let image2 = new Discord.EmbedBuilder()
                .setURL('https://www.google.com/search?q=' + args.join(' '))
                .setImage(`${response.items[1].image.thumbnailLink}`)
            let image3 = new Discord.EmbedBuilder()
                .setURL('https://www.google.com/search?q=' + args.join(' '))
                .setImage(`${response.items[2].image.thumbnailLink}`)
            let image4 = new Discord.EmbedBuilder()
                .setURL('https://www.google.com/search?q=' + args.join(' '))
                .setImage(`${response.items[3].image.thumbnailLink}`)
            let image5 = new Discord.EmbedBuilder()
                .setURL('https://www.google.com/search?q=' + args.join(' '))
                .setImage(`${response.items[4].image.thumbnailLink}`)

            message.reply({ embeds: [imageEmbed, image1, image2, image3, image4, image5], allowedMentions: { repliedUser: false } })
            fs.appendFileSync(`commands.log`, `\nCommand Information\nQuery: ${args.join(' ')}`)

        }
        if (interaction != null) {
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - image (interaction)\n${currentDate} | ${currentDateISO}\n recieved image command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

            let query = interaction.options.getString('query')

            if (!query) {
                return interaction.reply({ content: 'Please specify the name of the image you want to search.', allowedMentions: { repliedUser: false } })
            }
            let res =
                await fetch(`https://customsearch.googleapis.com/customsearch/v1?q=${query}&cx=${config.googlecx}&key=${config.googlekey}&searchType=image`).catch(error => fs.appendFileSync('other.log', "\n" + error));

            if (!res) return interaction.reply({ content: 'Unable to fetch the requested image.', allowedMentions: { repliedUser: false } })
            if (res.status >= 400) return interaction.reply({ content: `Error ${res.status}`, allowedMentions: { repliedUser: false } })

            let response = await res.json() as any;
            fs.writeFileSync('debug/image.json', JSON.stringify(response, null, 2))
            if (response.items.length < 1) return interaction.reply({ content: 'Error - no results found', allowedMentions: { repliedUser: false } })

            let resimg = ''
            let i: number;
            for (i = 0; i < 5 && i < response.items.length; i++) {
                resimg += `\n\n<${response.items[i].link}>`
            }

            let imageEmbed = new Discord.EmbedBuilder()
                .setTitle(`IMAGE RESULTS FOR ${query}`)
                .setDescription(`(NOTE - links may be unsafe)\n${resimg}`)

            interaction.reply({ embeds: [imageEmbed], allowedMentions: { repliedUser: false } })
            fs.appendFileSync(`commands.log`, `\nCommand Information\nquery: ${query}`)

        }
    }
}