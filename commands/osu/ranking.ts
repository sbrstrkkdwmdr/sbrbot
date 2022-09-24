import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import colourfunc = require('../../src/colourcalc');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');
import func = require('../../src/other');

module.exports = {
    name: 'ranking',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;
        let country = 'ALL';
        let mode = 'osu';
        let type: osuApiTypes.RankingType = 'performance';
        let page = 0;
        let spotlight;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                args[0] ? country = args[0].toUpperCase() : country = 'ALL';
            }
                break;
            //==============================================================================================================================================================================================
            case 'interaction': {
                commanduser = obj.member.user;
                obj.options.getString('country') ? country = obj.options.getString('country').toUpperCase() : country = 'ALL';
                obj.options.getString('mode') ? mode = obj.options.getString('mode').toLowerCase() : mode = 'osu';
                obj.options.getString('type') ? type = obj.options.getString('type').toLowerCase() : type = 'performance';
                obj.options.getInteger('page') ? page = obj.options.getInteger('page') - 1 : page = 0;
                obj.options.getInteger('spotlight') ? spotlight = obj.options.getInteger('spotlight') : spotlight = undefined;
            }
                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
                const pageParsed =
                    parseInt((obj.message.embeds[0].description).split('Page: ')[1].split('/')[0])
                page = pageParsed;
                switch (button) {
                    case 'BigLeftArrow':
                        page = 1
                        break;
                    case 'LeftArrow':
                        page = pageParsed - 1
                        break;
                    case 'RightArrow':
                        page = pageParsed + 1
                        break;
                    case 'BigRightArrow':
                        page = parseInt((obj.message.embeds[0].description).split('Page:')[1].split('/')[1].split('\n')[0])
                        break;
                    default:
                        page = pageParsed
                        break;
                }
                let base: string = obj.message.embeds[0].title;
                if (base.includes('Global')) {
                    base = base.split('Global ')[1];
                }
                if (base.includes('for ')) {
                    base = base.split('for ')[0];
                    obj.message.embeds[0].footer ? country = obj.message.embeds[0].footer.text.split('Country: ')[1] : country = 'ALL';
                }
                mode = base.split(' ')[0].toLowerCase().replaceAll('!', '');
                //@ts-expect-error - type string not assignable to type RankingType
                type = base.split(' ')[1].toLowerCase();
                if (type == 'charts') {
                    spotlight = obj.message.embeds[0].description.split('\n')[1].split('?spotlight=')[1].split(')')[0];
                }
            }
                break;
        }
        if (overrides != null) {
            page = overrides.page ?? page;
        }
        //==============================================================================================================================================================================================

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-ranking-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅'),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-ranking-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-ranking-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-ranking-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶'),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-ranking-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡'),
            );
        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`Refresh-ranking-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔁'),
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'ranking',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [
                    {
                        name: 'country',
                        value: country
                    },
                    {
                        name: 'mode',
                        value: mode
                    },
                    {
                        name: 'type',
                        value: type
                    },
                    {
                        name: 'page',
                        value: `${page}`
                    },
                    {
                        name: 'spotlight',
                        value: `${spotlight}`
                    }
                ]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        if (page < 2 || typeof page != 'number' || isNaN(page)) {
            page = 1;
        }
        page--

        let url = `rankings/${mode}/${type}`;
        if (country != 'ALL') {
            if (type == 'performance') {
                url += `?country=${country}`
            }
        }
        if (type == 'charts' && !isNaN(+spotlight)) {
            url += '?spotlight=' + spotlight;
        }

        const rankingdata: osuApiTypes.Rankings = await osufunc.apiget('custom', url, null, 2, 0, true).catch(async () => {
            if (country != 'ALL') {
                await obj.reply({
                    content: 'Invalid country code',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            } else {
                await obj.reply({
                    content: 'Error',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            return;
        }
        )
        try {
            osufunc.debug(rankingdata, 'command', 'ranking', obj.guildId, 'rankingData')
        } catch (e) {
            return;
        }
        if (rankingdata.ranking.length == 0) {
            obj.reply({
                content: 'No data found',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
            return;
        }
        //if country > show countryh icon, country total pp, score

        let ifchart = '';
        if (type == 'charts') {
            ifchart = `[${rankingdata.spotlight.name}](https://osu.ppy.sh/rankings/${mode}/charts?spotlight=${rankingdata.spotlight.id})`
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle(country != 'ALL' ?
                `${mode == 'osu' ? 'osu!' : calc.toCapital(mode)} ${calc.toCapital(type)} Rankings for ${country}` :
                `Global ${mode == 'osu' ? 'osu!' : calc.toCapital(mode)} ${calc.toCapital(type)} Ranking`)
            .setColor(colours.embedColour.userlist.dec)
            .setDescription(`Page: ${page + 1}/${Math.ceil(rankingdata.ranking.length / 5)}\n${ifchart}\n`);
        country != 'ALL' ?
            embed.setThumbnail(`https://osuflags.omkserver.nl${country}`)
                .setFooter({
                    text: `Country: ${country}`
                })
            : '';

        if (page > Math.ceil(rankingdata.ranking.length / 5)) {
            page = Math.ceil(rankingdata.ranking.length / 5)
        }

        for (let i = 0; i < 5 && i + (page * 5) < rankingdata.ranking.length; i++) {
            const curuser = rankingdata.ranking[i + (page * 5)];
            if (!curuser) break;
            embed.addFields(
                [
                    {
                        name: `${i + 1 + (page * 5)}`,
                        value:
                            `[${curuser.user.username}](https://osu.ppy.sh/u/${curuser.user.id}/${mode})
                        Rank: ${curuser.global_rank == null ?
                                '---' :
                                func.separateNum(curuser.global_rank)
                            }
                            Score: ${curuser.total_score == null ? '---' : func.separateNum(curuser.total_score)} (${curuser.ranked_score == null ? '---' : func.separateNum(curuser.ranked_score)} ranked)
                            ${curuser.pp == null ? '---' : func.separateNum(curuser.pp)}pp
                            Accuracy: ${curuser.hit_accuracy == null ? '---' : curuser.hit_accuracy.toFixed(2)}%
                            Play count: ${curuser.play_count == null ? '---' : func.separateNum(curuser.play_count)}
                            `
                        ,
                        inline: false
                    }
                ]
            )
        }
        if (page + 1 >= Math.ceil(rankingdata.ranking.length / 5)) {
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[3].setDisabled(true);
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[4].setDisabled(true);
        }
        if (page == 0) {
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[0].setDisabled(true);
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[1].setDisabled(true);
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [embed],
                    components: [pgbuttons, buttons],
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
                    embeds: [embed],
                    components: [pgbuttons, buttons],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.message.edit({
                    content: '',
                    embeds: [embed],
                    components: [pgbuttons, buttons],
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