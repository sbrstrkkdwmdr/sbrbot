import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
import fetch from 'node-fetch';

module.exports = {
    name: 'image',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {

        let query;
        let iserr = false;

        if (message != null && interaction == null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - image (message)
${currentDate} | ${currentDateISO}
recieved image command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            query = args.join(' ');
            if (!args.length) {
                iserr = true;
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - image (interaction)
${currentDate} | ${currentDateISO}
recieved image command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            query = interaction.options.getString('query');
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - image (interaction)
${currentDate} | ${currentDateISO}
recieved image command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}

----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        const res = await fetch(`https://customsearch.googleapis.com/customsearch/v1?q=${query}&cx=${config.google.cx}&key=${config.google.apiKey}&searchType=image`).catch(error => fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, "\n" + error));

        if (!res || res.status !== 200) {
            obj.reply({
                content: 'Error: could not fetch the requested image.',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });
            return;
        }
        const response = await res.json() as any;
        fs.writeFileSync(`debug/image${obj.guildId}.json`, JSON.stringify(response, null, 2))

        if (!response.items) {
            obj.reply({
                content: `Error: no results found for \`${query}\``,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });
            return;
        }
        let resimg = '';
        let i: number;
        for (i = 0; i < response.items.length && i < 5; i++) {
            resimg += `\n\n<${response.items[i].link}>`
        }

        const imageEmbed = new Discord.EmbedBuilder()
            .setURL(`${'https://www.google.com/search?q=' + query}`)
            .setTitle(`IMAGE RESULTS FOR ${query}`)
            .setDescription(`(NOTE - links may be unsafe)\n${resimg}`)
            .setColor(colours.embedColour.query.hex)

        const image1 = new Discord.EmbedBuilder()
            .setURL(`${'https://www.google.com/search?q=' + query.replaceAll(' ', '+')}`)
            .setImage(`${response.items[0].image.thumbnailLink}`)
        const image2 = new Discord.EmbedBuilder()
            .setURL(`${'https://www.google.com/search?q=' + query.replaceAll(' ', '+')}`)
            .setImage(`${response.items[1].image.thumbnailLink}`)
        const image3 = new Discord.EmbedBuilder()
            .setURL(`${'https://www.google.com/search?q=' + query.replaceAll(' ', '+')}`)
            .setImage(`${response.items[2].image.thumbnailLink}`)
        const image4 = new Discord.EmbedBuilder()
            .setURL(`${'https://www.google.com/search?q=' + query.replaceAll(' ', '+')}`)
            .setImage(`${response.items[3].image.thumbnailLink}`)
        const image5 = new Discord.EmbedBuilder()
            .setURL(`${'https://www.google.com/search?q=' + query.replaceAll(' ', '+')}`)
            .setImage(`${response.items[4].image.thumbnailLink}`)

        //SEND/EDIT MSG==============================================================================================================================================================================================

        obj.reply({
            embeds: [imageEmbed, image1, image2, image3, image4, image5],
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        })
            .catch(error => { });


        if (button != null) {
            message.edit({
                content: '',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

        }


        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}