import fs = require('fs');
import colours = require('../../src/consts/colours');
import extypes = require('../../src/types/extratypes');
import Discord = require('discord.js');
import log = require('../../src/log');
import yts = require('yt-search');

module.exports = {
    name: 'ytsearch',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;
        let query: string;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                query = args.join(' ');
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                query = obj.options.getString('query');
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }


        //==============================================================================================================================================================================================

        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-ytsearch-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅')
                /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-ytsearch-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-ytsearch-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶')
                /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-ytsearch-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡')
                /* .setLabel('End') */,
            );

        log.logFile(
            'command',
            log.commandLog('ytsearch', commandType, absoluteID, commanduser
            ),
            {
                guildId: `${obj.guildId}`
            })

        //OPTIONS==============================================================================================================================================================================================

        log.logFile('command',
            log.optsLog(absoluteID, [
                {
                    name: 'Query',
                    value: query
                }
            ]),
            {
                guildId: `${obj.guildId}`
            }
        )

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (!query || query.length < 1) {
            return obj.reply({
                content: 'Please provide a search query.',
                ephemeral: true
            })
        }
        const searchEmbed: Discord.EmbedBuilder = new Discord.EmbedBuilder()
            .setTitle(`YouTube search results for: ${query}`)
            .setColor(colours.embedColour.query.dec);

        const initSearch: extypes.ytSearch = await yts.search(query);
        fs.writeFileSync(`debug/command-ytsearch=ytsSearch=${obj.guildId}.json`, JSON.stringify(initSearch, null, 4), 'utf-8')


        if (initSearch.videos.length < 1) {
            searchEmbed.setDescription('No results found.')
        } else {
            const objs = initSearch.videos
            for (let i = 0; i < 5 && i < objs.length; i++) {
                const curItem = objs[i];
                searchEmbed.addFields([
                    {
                        name: `#${i + 1}`,
                        value: `[${curItem.title}](${curItem.url})
Published by [${curItem.author.name}](${curItem.author.url}) ${curItem.ago}
Duration: ${curItem.timestamp} (${curItem.duration.seconds}s)
Description: \`${curItem.description}\`
`,
                        inline: false
                    }
                ])
            }
        }


        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [searchEmbed],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                obj.reply({
                    content: '',
                    embeds: [searchEmbed],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.edit({
                    content: '',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
        }



        log.logFile('command',
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`,
            { guildId: `${obj.guildId}` }
        )
    }
}