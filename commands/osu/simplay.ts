import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import osufunc = require('../../calc/osufunc');
import cmdchecks = require('../../calc/commandchecks');
import colours = require('../../configs/colours');
import osuApiTypes = require('../../configs/osuApiTypes');

module.exports = {
    name: 'simplay',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        const accessN = fs.readFileSync('configs/osuauth.json', 'utf-8');
        const access_token = JSON.parse(accessN).access_token;

        if (message != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            const embed = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.score.hex)

                ;
            const x = args.join(' ');
            let mapid;
            let prevmap;
            if (args[0] && !isNaN(args[0])) {
                mapid = parseInt(args[0]);
            } else {
                if (fs.existsSync(`./debugosu/prevmap${message.guildId}.json`)) {
                    try {
                        prevmap = JSON.parse(fs.readFileSync(`./debugosu/prevmap${message.guildId}.json`, 'utf8'));
                    } catch {
                        console.log(`no prevmap.json id found for server ${message.guildId}\nCreating default file...`)
                        fs.writeFileSync(`./debugosu/prevmap${message.guildId}.json`, JSON.stringify(({ id: 32345 }), null, 2));
                        prevmap = { id: 32345 }
                    }
                } else {
                    console.log(`no prevmap.json file for server ${message.guildId}\nCreating default file...`)
                    fs.writeFileSync(`./debugosu/prevmap${message.guildId}.json`, JSON.stringify(({ id: 32345 }), null, 2));
                    prevmap = { id: 32345 }
                }
                mapid = prevmap.id;
            }
            let mods: string;
            let miss1: string;
            let combo1: string;
            let acc1: string;

            let miss: number = 0;
            let combo: number;
            let acc: number = 100;

            try {
                mods = x.includes('+') ? x.split('+')[1].split(' ')[0] : 'NM';
            } catch { }
            try {
                miss1 = x.includes('miss') ? x.split('miss=')[1].split(' ')[0] : 0;
            } catch { }
            try {
                acc1 = x.includes('acc') ? x.split('acc=')[1].split(' ')[0] : 100.00;
            } catch { }
            try {
                combo1 = x.includes('combo') ? x.split('combo=')[1].split(' ')[0] : 'e';
            } catch { }
            const mapdata: osuApiTypes.Beatmap = await osufunc.apiget('map', mapid)
            try {
                if (mapdata.authentication) {
                    fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                        `
    ----------------------------------------------------
    cmd ID: ${absoluteID}
    Error - authentication
    ----------------------------------------------------`)
                    if (button == null) {
                        obj.reply({ content: 'error - osu auth out of date. Updating token...', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                            .catch();
                    }
                    await osufunc.updateToken();
                    return;
                }
                if (typeof mapdata.error != 'undefined' && mapdata.error == null) {
                    fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                        `
    ----------------------------------------------------
    cmd ID: ${absoluteID}
    Error - ${mapdata.error}
    ----------------------------------------------------`)
                    if (button == null) {
                        await obj.reply({ content: `error - ${mapdata.error}`, allowedMentions: { repliedUser: false }, failIfNotExists: true })
                            .catch();
                    }
                    return;
                }
            } catch (error) {
            }

            if (combo1 == 'e') {
                combo = mapdata.max_combo;
            } else {
                combo = parseInt(combo1);
            }
            if (isNaN(parseFloat(miss1))) {
                miss = 0;
            } else {
                miss = parseInt(miss1);
            }

            if (isNaN(parseFloat(acc1))) {
                acc = 100.00;
            } else {
                acc = parseFloat(acc1);
            }
            if (isNaN(parseFloat(combo1))) {
                combo = mapdata.max_combo;
            } else {
                combo = parseInt(combo1);
            }

            const simplay = await osufunc.scorecalc(mods, 'osu', mapid, null, null, null, null, null, miss, acc, combo, null, 0, null, false);
            const mapcalc = await osufunc.mapcalc(mods, 'osu', mapid, 0);

            fs.writeFileSync(`./debugosu/command-simulate=playcalc=${obj.guildId}.json`, JSON.stringify(simplay, null, 2));

            try {
                const test = simplay[0].pp
            } catch (error) {
                embed
                    .setTitle('There was an error calculating your play')
                    .setDescription('Please make sure you entered the beatmap id not the map**set** id')

                message.reply({
                    embeds: [embed],
                    allowedMentions: { repliedUser: false },
                })
                    .catch(error => { });

                return;
            }

            embed
                .setTitle(`Simulated play on ${mapdata.beatmapset.title} [${mapdata.version}]`)
                .setURL(`https://osu.ppy.sh/b/${mapid}`)
                .setThumbnail(`https://assets.ppy.sh/beatmaps/${mapdata.beatmapset.id}/covers/list@2x.jpg`)
                .addFields([ //error
                    {
                        name: 'Map Details',
                        value: `
                ${acc.toFixed(2)}% | ${miss}x miss | ${combo}x/**${simplay[0].maxCombo}x** 
                ${mods} | ${simplay[0].stars.toFixed(2)}⭐
                CS${simplay[0].cs.toFixed(2)} AR${simplay[0].ar.toFixed(2)} HP${simplay[0].hp.toFixed(2)} OD${simplay[0].od.toFixed(2)}
                `, inline: true
                    },
                    {
                        name: 'Performance',
                        value:
                            `
\`Current: ${simplay[0].pp.toFixed(2)}pp | FC: ${simplay[1].pp.toFixed(2)}pp 
SS: ${mapcalc[0].pp.toFixed(2)}pp   | 95: ${mapcalc[5].pp.toFixed(2)}pp\`
                        `,
                        inline: true
                    }
                ]
                )
            message.reply({
                embeds: [embed],
                allowedMentions: { repliedUser: false },
            })
                .catch(error => { });

            fs.writeFileSync(`./debugosu/prevmap${message.guildId}.json`, JSON.stringify({ id: mapid }, null, 2));

        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

            const buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-simplay-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-simplay-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-simplay')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-simplay-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-simplay-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
        }

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, '\nsuccess\n\n', 'utf-8')
    }
}