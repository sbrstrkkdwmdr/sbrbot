import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import calc = require('../../calc/calculations');
import emojis = require('../../configs/emojis');
import colours = require('../../configs/colours');
import osufunc = require('../../calc/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../configs/osuApiTypes');


module.exports = {
    name: 'compare',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let commanduser;
        let baseCommandType;
        let compareType = 'user';
        let first;
        let second;
        let prevuser;
        let prevscore;
        try {
            prevuser = (JSON.parse(fs.readFileSync(`debugosu/prevuser${obj.guildId}.json`, 'utf8')).id);
        } catch (err) {
            prevuser = 'peppy';
        }
        try {
            prevscore = (JSON.parse(fs.readFileSync(`debugosu/prevscore${obj.guildId}.json`, 'utf8')).id);
        } catch (err) {
            prevscore = JSON.parse(fs.readFileSync('files/testScore.json', 'utf8'));
        }
        if (message != null && interaction == null && button == null) {
            commanduser = message.author;
            baseCommandType = 'message';
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            commanduser = interaction.member.user;
            baseCommandType = 'interaction';
            compareType = interaction.options.getString('type');
            first = interaction.options.getString('first');
            second = interaction.options.getString('second');
            if (compareType == null) {
                compareType = 'score';
            }
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            commanduser = interaction.member.user;
            baseCommandType = 'button';
        }

        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-compare-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('⬅')
                    /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-compare-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-compare-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('▶')
                    /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-compare-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('➡')
                    /* .setLabel('End') */,
            );
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
COMMAND EVENT - compare (${baseCommandType})
${currentDate} | ${currentDateISO}
recieved compare command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Options: 
    type: ${compareType}
    first: ${first}
    second: ${second}
----------------------------------------------------
`, 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        if (compareType == 'user') {
            if (!first && second) {
                first = prevuser
            }
            if (!second && first) {
                second = prevuser
            }
            if (!first && !second) {
                first = null
                second = prevuser
            }
        }
        if (compareType == 'score') {
            if (!first || first == null) {
                first = prevscore
            }
            if (!second || second == null) {
                second = prevscore
            }
            if (!first && !second) {
                first = null
                second = prevscore
            }
        }
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Options(2): 
    type: ${compareType}
    first: ${first}
    second: ${second}
----------------------------------------------------
`, 'utf-8')
        const Embeds = [];
        try {
            if (compareType == 'user') {
                if (first == null) {
                    const findname = await userdata.findOne({ where: { userid: commanduser.id } })
                    if (findname != null) {
                        first = findname.get('osuname');
                    } else {
                        first = 'peppy'
                    }
                }
                const firstuser: osuApiTypes.User = await osufunc.apiget('user', first)
                    .catch(error => {
                        throw new Error(`Api Error: user \`${first}\``)
                    });
                if (firstuser?.error) {
                    obj.reply({
                        content: `${firstuser?.error ? firstuser?.error : 'Error: null'}`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: false,
                    }).catch()
                    return;
                }

                const seconduser: osuApiTypes.User = await osufunc.apiget('user', second)
                    .catch(error => {
                        throw new Error(`Api Error: user \`${second}\``)
                    });
                if (seconduser?.error) {
                    obj.reply({
                        content: `${seconduser?.error ? seconduser?.error : 'Error: null'}`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: false,
                    }).catch()
                    return;
                }

                fs.writeFileSync(`debugosu/prevuser${obj.guildId}.json`, JSON.stringify({ id: firstuser.username }), 'utf8');
                fs.writeFileSync(`debugosu/command-compare=firstuserdata=${obj.guildId}.json`, JSON.stringify(firstuser, null, 2), 'utf8');
                fs.writeFileSync(`debugosu/command-compare=seconduserdata=${obj.guildId}.json`, JSON.stringify(seconduser, null, 2), 'utf8');

                const uEmbed = new Discord.EmbedBuilder()
                    .setColor(colours.embedColour.userlist.hex)
                    .setTitle(`Comparing ${firstuser.username} and ${seconduser.username}`)
                    .addFields([
                        {
                            name: `**${firstuser.username}**`,
                            value:
                                `**Rank:** ${`${firstuser?.statistics.global_rank}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**pp:** ${`${firstuser?.statistics.pp}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**Accuracy:** ${(firstuser?.statistics.hit_accuracy != null ? firstuser.statistics.hit_accuracy : 0).toFixed(2)}%
**Playcount:** ${`${firstuser?.statistics.play_count}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**Level:** ${`${firstuser.statistics.level.current}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
`,
                            inline: true
                        },
                        {
                            name: `**${seconduser.username}**`,
                            value:
                                `**Rank:** ${`${seconduser?.statistics.global_rank}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**pp:** ${`${seconduser?.statistics.pp}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**Accuracy:** ${(seconduser?.statistics.hit_accuracy != null ? seconduser.statistics.hit_accuracy : 0).toFixed(2)}%
**Playcount:** ${`${seconduser?.statistics.play_count}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**Level:** ${`${seconduser.statistics.level.current}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
`,
                            inline: true
                        },
                        {
                            name: `**Difference**`,
                            value:
                                `**Rank:** ${firstuser.statistics.global_rank - seconduser.statistics.global_rank}
**pp:** ${firstuser?.statistics.pp - seconduser?.statistics.pp}
**Accuracy:** ${((firstuser.statistics.hit_accuracy != null ? firstuser.statistics.hit_accuracy : 0) - (seconduser.statistics.hit_accuracy != null ? seconduser.statistics.hit_accuracy : 0)).toFixed(2)}%
**Playcount:** ${firstuser.statistics.play_count - seconduser.statistics.play_count}
**Level:** ${firstuser.statistics.level.current - seconduser.statistics.level.current}
`,
                        }
                    ])
                    ;
                Embeds.push(uEmbed);
            } else {
                let firstscore: osuApiTypes.Score = null;
                let fscoresarray: osuApiTypes.Score[] = null;
                const secondscore: osuApiTypes.Score =
                    second != prevscore ?
                        await osufunc.apiget('score', second)
                            .catch(error => {
                                throw new Error(`Api Error: score \`${second}\` not found`)
                            }) : prevscore;
                ;
                if (firstscore?.error) {
                    obj.reply({
                        content: `${firstscore?.error ? firstscore?.error : 'Error: null'}`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: false,
                    }).catch()
                    return;
                }
                if (secondscore?.error) {
                    obj.reply({
                        content: `${secondscore?.error ? secondscore?.error : 'Error: null'}`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: false,
                    }).catch()
                    return;
                }

                if (first == null) {
                    let testu;
                    const findname = await userdata.findOne({ where: { userid: commanduser.id } })
                    if (findname != null) {
                        testu = findname.get('osuname');
                        let testu2 = await osufunc.apiget('user', testu)
                            .catch(error => {
                                throw new Error(`Api Error: user \`${testu}\` not found`)
                            });
                        fscoresarray = await osufunc.apiget('user_get_scores_map', `${secondscore.beatmap.id}`, `${testu2.id}`)
                            .catch(error => {
                                throw new Error(`Api Error: beatmap \`${secondscore.beatmap.id}\` or user ${testu2.id} not found`)
                            });
                    } else {
                        firstscore = await osufunc.apiget('score', second)
                            .catch(error => {
                                throw new Error(`Api Error: score \`${second}\` not found`)
                            });
                    }
                } else {
                    firstscore = await osufunc.apiget('score', first)
                        .catch(error => {
                            throw new Error(`Api Error: score \`${second}\` not found`)
                        });
                }

                if (fscoresarray != null) {
                    const secondmodfiltered = osumodcalc.OrderMods(secondscore.mods.join(''))
                        .replaceAll('HD', '').replaceAll('NF', '').replaceAll('SO', '')
                        .replaceAll('SD', '').replaceAll('PF', '').replaceAll('TD', '')
                        .replaceAll('FI', '').replaceAll('RD', '').replaceAll('HD', '')

                    //all of the mods in "secondmodfiltered" are in score.mods
                    let altarray = fscoresarray.filter(score =>
                        secondmodfiltered == osumodcalc.OrderMods(score.mods.join(''))
                            .replaceAll('HD', '').replaceAll('NF', '').replaceAll('SO', '')
                            .replaceAll('SD', '').replaceAll('PF', '').replaceAll('TD', '')
                            .replaceAll('FI', '').replaceAll('RD', '').replaceAll('HD', '')
                    );
                    firstscore = altarray[0];
                }

                const sEmbed = new Discord.EmbedBuilder()
                    .setColor(colours.embedColour.scorelist.hex)
                    .setTitle(`Comparing two scores on ${firstscore.beatmapset.title} [${firstscore.beatmap.version}]`)
                    .setURL(`https://osu.ppy.sh/beatmapsets/${firstscore.beatmapset.id}#osu/${firstscore.beatmap.id}`)
                    .addFields([
                        {
                            name: `**${firstscore.user.username}**`,
                            value:
                                `**Score:** ${`${firstscore.score}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**pp:** ${`${firstscore.pp}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**Accuracy:** ${(firstscore.accuracy * 100).toFixed(2)}%
**Combo:** ${firstscore.max_combo}x/${firstscore.beatmap.max_combo}x
**Hits:** ${firstscore.statistics.count_300}/${firstscore.statistics.count_100}/${firstscore.statistics.count_50}/${firstscore.statistics.count_miss}
**Mods:** ${firstscore.mods.join('')}
**URL:** https://osu.ppy.sh/scores/osu/${firstscore.best_id ? firstscore.best_id : firstscore.id}
`,
                            inline: true,
                        },
                        {
                            name: `**${secondscore.user.username}**`,
                            value:
                                `**Score:** ${`${secondscore.score}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**pp:** ${`${secondscore.pp}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**Accuracy:** ${(secondscore.accuracy * 100).toFixed(2)}%
**Combo:** ${secondscore.max_combo}x/${secondscore.beatmap.max_combo}x
**Hits:** ${secondscore.statistics.count_300}/${secondscore.statistics.count_100}/${secondscore.statistics.count_50}/${secondscore.statistics.count_miss}
**Mods:** ${secondscore.mods.join('')}
**URL:** https://osu.ppy.sh/scores/osu/${secondscore.best_id ? secondscore.best_id : secondscore.id}
`,
                            inline: true,

                        },
                        {
                            name: `**Difference**`,
                            value:
                                `**Score:** ${firstscore.score - secondscore.score}
**pp:** ${firstscore.pp - secondscore.pp}
**Accuracy:** ${(firstscore.accuracy * 100 - secondscore.accuracy * 100).toFixed(2)}%
**Combo:** ${firstscore.max_combo - secondscore.max_combo}x
**Hits:** ${firstscore.statistics.count_300 - secondscore.statistics.count_300}/${firstscore.statistics.count_100 - secondscore.statistics.count_100}/${firstscore.statistics.count_50 - secondscore.statistics.count_50}/${firstscore.statistics.count_miss - secondscore.statistics.count_miss}
`
                        }
                    ])
                    ;
                Embeds.push(sEmbed);
            }
        } catch (error) {
            if (compareType == 'user') {
                const uEmbed = new Discord.EmbedBuilder()
                    .setColor(colours.embedColour.admin.hex)
                    .setTitle(`Error comparing users`)
                    .setDescription(`\`\`\`${error}\`\`\`
                    params:
Type: \`${compareType}\`
First: \`${first}\`
Second: \`${second}\`
                    `)
                    ;
                Embeds.push(uEmbed);
            }
            if (compareType == 'score') {
                const sEmbed = new Discord.EmbedBuilder()
                    .setColor(colours.embedColour.admin.hex)
                    .setTitle(`Error comparing scores`)
                    .setDescription(`
params:
Type: \`${compareType}\`
First: \`${first}\`
Second: \`${second}\`

                    `)
                    ;
                Embeds.push(sEmbed);
            }
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================

        if (message != null && interaction == null && button == null) {
            message.reply({
                embeds: Embeds,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

        }
        if (interaction != null && button == null && message == null) {
            interaction.reply({
                embeds: Embeds,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

        }
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