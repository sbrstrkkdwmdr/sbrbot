import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
import yts = require('yt-search');

module.exports = {
    name: 'ytsearch',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let i: number;
        let query: string;

        if (message != null && interaction == null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - ytsearch (message)
${currentDate} | ${currentDateISO}
recieved ytsearch command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            query = args.join(' ');
            if (!args[0]) {
                message.reply({
                    content: 'Please provide a search query.',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true,
                })
                return;
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - ytsearch (interaction)
${currentDate} | ${currentDateISO}
recieved ytsearch command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            query = interaction.options.getString('query')
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - ytsearch (interaction)
${currentDate} | ${currentDateISO}
recieved ytsearch command
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
query: ${query}
----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (!query) {
            return obj.reply({ content: 'Please specify the video you want to search.', allowedMentions: { repliedUser: false } })
                .catch(error => { });

        }
        const searching = await yts.search(query)
        if (searching.videos.length < 1) {
            return obj.reply({ content: 'No results found', allowedMentions: { repliedUser: false } })
                .catch(error => { });

        }
        const vids = searching.videos
        const embed = new Discord.EmbedBuilder()
            .setTitle(`Results for ${query}`)
            .setColor(colours.embedColour.query.hex)
            ;
        for (i = 0; i < 5 && i < vids.length; i++) {
            embed.addFields([{
                name: `#${i + 1}`,
                value: `[${cmdchecks.shorten(vids[i].title)}](${vids[i].url})
            Published by [${vids[i].author.name}](${vids[i].author.url})
            ${vids[i].ago}
            Duration: ${vids[i].timestamp} (${vids[i].seconds}s)
            Description: \`${vids[i].description}\`
            `,
                inline: false
            }])
        }
        fs.writeFileSync(`debug/ytsearc${obj.guildId}h.json`, JSON.stringify(searching, null, 2))


        //SEND/EDIT MSG==============================================================================================================================================================================================

        obj.reply({
            embeds: [embed],
            allowedMentions: { repliedUser: false },
            failIfNotExists: true,
        })


        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}