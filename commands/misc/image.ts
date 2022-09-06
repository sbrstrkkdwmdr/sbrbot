import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import colourfunc = require('../../src/colourcalc');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import extypes = require('../../src/types/extraTypes');
import Discord = require('discord.js');
import log = require('../../src/log');
import fetch from 'node-fetch';


module.exports = {
    name: 'image',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;
        let query;
        let iserr = false;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                query = args.join(' ');
                if (!args[0]) {
                    iserr = true;
                }
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                query = obj.options.getString('query')
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }
        if (overrides != null) {

        }

        //==============================================================================================================================================================================================

        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-image-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅')
                /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-image-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-image-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶')
                /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-image-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡')
                /* .setLabel('End') */,
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'image',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [{
                    name: 'Query',
                    value: query
                }]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        const res = await fetch(
            `https://customsearch.googleapis.com/customsearch/v1?q=${query}&cx=${config.google.cx}&key=${config.google.apiKey}&searchType=image`
        )


        if (!res || res.status !== 200) {
            obj.reply({
                content: 'Error: could not fetch the requested image.',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });
            return;
        }

        const response: extypes.imagesearches = await res.json() as any;
        fs.writeFileSync(`debug/command-image=imageSearch=${obj.guildId}.json`, JSON.stringify(response, null, 4), 'utf-8')

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
        .setURL(`${'https://www.google.com/search?q=' + query.replaceAll(' ', '+')}`)
        .setTitle(`IMAGE RESULTS FOR ${query}`)
            .setDescription(`(NOTE - links may be unsafe)\n${resimg}`)
            .setColor(colours.embedColour.query.dec);
        const useEmbeds = [imageEmbed];

        for (let i = 0; i < 5; i++) {
            const curimg = new Discord.EmbedBuilder()
                .setURL(`${'https://www.google.com/search?q=' + query.replaceAll(' ', '+')}`)
                .setImage(`${response.items[i].image.thumbnailLink}`)
            useEmbeds.push(curimg);
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: useEmbeds,
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
                    embeds: useEmbeds,
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



        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}