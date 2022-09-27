import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');
import func = require('../../src/other');
import def = require('../../src/consts/defaults');

module.exports = {
    name: 'compare',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let compareType;
        let first;
        let second;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                compareType = 'score';
                if (args[0]) {
                    compareType = args[0]
                }
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                compareType = obj.options.getString('type');
                first = obj.options.getString('first');
                second = obj.options.getString('second');
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }

        //==============================================================================================================================================================================================

        log.logFile(
            'command',
            log.commandLog('compare', commandType, absoluteID, commanduser
            ),
            {
                guildId: `${obj.guildId}`
            })

        //OPTIONS==============================================================================================================================================================================================
        log.logFile('command',
            log.optsLog(absoluteID, [{
                name: 'Compare Type',
                value: compareType
            },
            {
                name: 'First',
                value: first
            },
            {
                name: 'Second',
                value: second
            }]),
            {
                guildId: `${obj.guildId}`
            }
        )
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        let sendthething = false;

        const prevscore: osuApiTypes.Score = osufunc.getPreviousId('score', `${obj.guildId}`);
        const prevuser: osuApiTypes.User = osufunc.getPreviousId('user', `${obj.guildId}`);

        let firstScore: osuApiTypes.Score = prevscore;
        let secondScore: osuApiTypes.Score = prevscore;

        switch (compareType) {
            case 'user': {
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
                break;
            case 'score': {
                'heheheha'
            }
                break;
        }

        if (commandType == 'interaction') {
            obj.reply({
                content: 'Loading...',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
        }

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

                // fs.writeFileSync(`debug/prevuser${obj.guildId}.json`, JSON.stringify({ id: firstuser.username }), 'utf8');
                // fs.writeFileSync(`debug/command-compare=firstuserdata=${obj.guildId}.json`, JSON.stringify(firstuser, null, 2), 'utf8');
                // fs.writeFileSync(`debug/command-compare=seconduserdata=${obj.guildId}.json`, JSON.stringify(seconduser, null, 2), 'utf8');
                osufunc.debug(firstuser, 'command', 'compare', obj.guildId, 'firstUserData');
                osufunc.debug(seconduser, 'command', 'compare', obj.guildId, 'secondUserData');

                const uEmbed = new Discord.EmbedBuilder()
                    .setColor(colours.embedColour.userlist.dec)
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
                                `**Rank:** ${(firstuser.statistics.global_rank - seconduser.statistics.global_rank).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**pp:** ${(firstuser?.statistics.pp - seconduser?.statistics.pp).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**Accuracy:** ${((firstuser.statistics.hit_accuracy != null ? firstuser.statistics.hit_accuracy : 0) - (seconduser.statistics.hit_accuracy != null ? seconduser.statistics.hit_accuracy : 0)).toFixed(2)}%
**Playcount:** ${`${firstuser.statistics.play_count - seconduser.statistics.play_count}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**Level:** ${(firstuser.statistics.level.current - seconduser.statistics.level.current).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
`,
                        }
                    ])
                    ;
                Embeds.push(uEmbed);
                sendthething = true;

            } else if (compareType == 'score') {

                let secondScoresArray: osuApiTypes.Score[] = [];
                if (first == null) {
                    //do nothing
                } else {
                    firstScore = await osufunc.apiget('score', first)
                }
                if (second == null) {
                    //get current 
                } else {
                    secondScore = await osufunc.apiget('score', second)
                }
                if (first == null && second == null) {
                    firstScore = prevscore

                    //get current user id, then find their scores on the same map as the previous score

                    const cuser = await osufunc.searchUser(commanduser.id, userdata, true);
                    // user = cuser.username;
                    // mode = cuser.gamemode;
                    if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                        if (commandType != 'button') {
                            obj.reply({
                                content: 'User not found',
                                allowedMentions: { repliedUser: false },
                                failIfNotExists: true
                            }).catch()
                        }
                        return;
                    }
                    const osudata = await osufunc.apiget('user', cuser.username);
                    if (osudata?.error) {
                        if (commandType != 'button') obj.reply({
                            content: `${osudata?.error ? osudata?.error : 'Error: null'}`,
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: false,
                        }).catch()
                        return;
                    }
                    const secondScoresArrayInt: any = await osufunc.apiget('user_get_scores_map', `${prevscore.beatmap.id}`, `${osudata.id}`)
                    secondScoresArray = secondScoresArrayInt.scores
                    const match = await osufunc.matchScores(firstScore, secondScoresArray).sort(
                        (a, b) => b.score - a.score
                    )
                    secondScore = match.length > 0 ? match[0] : secondScoresArray.length > 0 ? secondScoresArray.slice().sort((a, b) => b.score - a.score)[0] : prevscore;
                }

                osufunc.debug(firstScore, 'command', 'compare', obj.guildId, 'firstScoreData');
                osufunc.debug(secondScore, 'command', 'compare', obj.guildId, 'secondScoreData');

                const sEmbed = new Discord.EmbedBuilder()
                    .setColor(colours.embedColour.scorelist.dec)
                    .setTitle(`Comparing two scores on ${firstScore.beatmapset.title} [${firstScore.beatmap.version}]`)
                    .setURL(`https://osu.ppy.sh/beatmapsets/${firstScore.beatmapset.id}#osu/${firstScore.beatmap.id}`)
                    .addFields([
                        {
                            name: `**${firstScore.user.username}**`,
                            value:
                                `**Score:** ${`${firstScore.score}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**pp:** ${`${firstScore.pp}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**Accuracy:** ${(firstScore.accuracy * 100).toFixed(2)}%
**Combo:** ${firstScore.max_combo}x/${firstScore.beatmap.max_combo}x
**Hits:** ${firstScore.statistics.count_300}/${firstScore.statistics.count_100}/${firstScore.statistics.count_50}/${firstScore.statistics.count_miss}
**Mods:** ${firstScore.mods.join('')}
**URL:** https://osu.ppy.sh/scores/osu/${firstScore.best_id ?? firstScore.id}
`,
                            inline: true,
                        },
                        {
                            name: `**${secondScore.user.username}**`,
                            value:
                                `**Score:** ${`${secondScore.score}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**pp:** ${`${secondScore.pp}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
**Accuracy:** ${(secondScore.accuracy * 100).toFixed(2)}%
**Combo:** ${secondScore.max_combo}x/${secondScore.beatmap.max_combo}x
**Hits:** ${secondScore.statistics.count_300}/${secondScore.statistics.count_100}/${secondScore.statistics.count_50}/${secondScore.statistics.count_miss}
**Mods:** ${secondScore.mods.join('')}
**URL:** https://osu.ppy.sh/scores/osu/${secondScore.best_id ? secondScore.best_id : secondScore.id}
`,
                            inline: true,

                        },
                        {
                            name: `**Difference**`,
                            value:
                                `**Score:** ${firstScore.score - secondScore.score}
**pp:** ${firstScore.pp - secondScore.pp}
**Accuracy:** ${(firstScore.accuracy * 100 - secondScore.accuracy * 100).toFixed(2)}%
**Combo:** ${firstScore.max_combo - secondScore.max_combo}x
**Hits:** ${firstScore.statistics.count_300 - secondScore.statistics.count_300}/${firstScore.statistics.count_100 - secondScore.statistics.count_100}/${firstScore.statistics.count_50 - secondScore.statistics.count_50}/${firstScore.statistics.count_miss - secondScore.statistics.count_miss}
`
                        }
                    ])
                    ;
                Embeds.push(await sEmbed);
                sendthething = true;
            } else if (compareType == 'top') {

            }
        } catch (error) {
            if (compareType == 'user') {
                const uEmbed = new Discord.EmbedBuilder()
                    .setColor(colours.embedColour.admin.dec)
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
                    .setColor(colours.embedColour.admin.dec)
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
        function send() {
            if (sendthething == false) {
                send()
            } else {
                switch (commandType) {
                    case 'message': {
                        obj.reply({
                            content: '',
                            embeds: Embeds,
                            files: [],
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                            .catch();
                    }
                        break;

                    //==============================================================================================================================================================================================

                    case 'interaction': {
                        setTimeout(() => {
                            obj.reply({
                                content: '',
                                embeds: Embeds,
                                files: [],
                                allowedMentions: { repliedUser: false },
                                failIfNotExists: true
                            })
                                .catch();
                        }, 1000)
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
    }
}