const fs = require('fs')
const fetch = require('node-fetch')

module.exports = {
    name: 'image',
    description: 'null',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - image (message)\n${currentDate} | ${currentDateISO}\n recieved image command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')

            if (!args.length) {
                return message.channel.send('Please specify the name of the image you want to search.')
            }
            let res =
                await fetch(`https://customsearch.googleapis.com/customsearch/v1?q=${args.join(' ')}&cx=${config.googlecx}&key=${config.googlekey}&searchType=image`).catch(error => fs.appendFileSync(otherlogdir, "\n" + e));

            if (!res) return message.channel.send('Unable to fetch the requested image.')
            if (res.status >= 400) return message.channel.status(`Error ${res.status}`)

            response = await res.json();
            fs.writeFileSync('debug/image.json', JSON.stringify(response, null, 2))
            if (response.items.length < 1) return message.channel.send('Error - no results found')

            let resimg = ''
            for (i = 0; i < 5 && i < response.items.length; i++) {
                resimg += `\n\n<${response.items[i].link}>`
            }
            let imageEmbed = new Discord.MessageEmbed()
                .setTitle(`IMAGE RESULTS FOR ${args.join(' ')}`)
                .setDescription(`${resimg}`)
            message.channel.send({ embeds: [imageEmbed] })
            fs.appendFileSync('commands.log', `\nCommand Information\nQuery: ${args.join(' ')}`)

        }
        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - image (interaction)\n${currentDate} | ${currentDateISO}\n recieved image command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

            let query = interaction.options.getString('query')

            if (!query) {
                return interaction.reply('Please specify the name of the image you want to search.')
            }
            let res =
                await fetch(`https://customsearch.googleapis.com/customsearch/v1?q=${query}&cx=${config.googlecx}&key=${config.googlekey}&searchType=image`).catch(error => fs.appendFileSync('other.log', "\n" + error));

            if (!res) return interaction.reply('Unable to fetch the requested image.')
            if (res.status >= 400) return interaction.reply(`Error ${res.status}`)

            response = await res.json();
            fs.writeFileSync('debug/image.json', JSON.stringify(response, null, 2))
            if (response.items.length < 1) return interaction.reply('Error - no results found')

            let resimg = ''
            for (i = 0; i < 5 && i < response.items.length; i++) {
                resimg += `\n\n<${response.items[i].link}>`
            }

            let imageEmbed = new Discord.MessageEmbed()
                .setTitle(`IMAGE RESULTS FOR ${query}`)
                .setDescription(`${resimg}`)

            interaction.reply({ embeds: [imageEmbed] })
            fs.appendFileSync('commands.log', `\nCommand Information\nquery: ${query}`)

        }
    }
}