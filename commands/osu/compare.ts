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
import def = require('../../src/consts/defaults');

module.exports = {
    name: 'compare',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;
        let type: 'profile' | 'top' | 'mapscore' = 'top';
        let first = null;
        let second = null;
        let firstsearchid = null;
        let secondsearchid = null;
        let mode = 'osu';

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                if (obj.mentions.users.size > 1) {
                    firstsearchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;
                    secondsearchid = obj.mentions.users.size > 1 ? obj.mentions.users.at(1).id : null;
                } else if (obj.mentions.users.size == 1) {
                    firstsearchid = obj.author.id;
                    secondsearchid = obj.mentions.users.at(0).id
                } else {
                    firstsearchid = obj.author.id
                }
                first = null;
                second = args[0] ?? null;
                if (args[1]) {
                    first = args[0];
                    second = args[1];
                }
                first != null && first.includes(firstsearchid) ? first = null : null;
                second != null && second.includes(secondsearchid) ? second = null : null;
            }
                break;
            //==============================================================================================================================================================================================
            case 'interaction': {
                commanduser = obj.member.user;
                type = obj.options.getString('type') ?? 'profile';
                first = obj.options.getString('first');
                second = obj.options.getString('second');
                firstsearchid = commanduser.id
                mode = obj.options.getString('mode') ?? 'osu'
                if (second == null && first != null) {
                    second = first;
                    first = null;
                }
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

        log.logFile(
            'command',
            log.commandLog('compare', commandType, absoluteID, commanduser
            ),
            {
                guildId: `${obj.guildId}`
            })
        //OPTIONS==============================================================================================================================================================================================
        log.logFile('command',
            log.optsLog(absoluteID, [
                {
                    name: 'Type',
                    value: type
                },
                {
                    name: 'First',
                    value: first
                },
                {
                    name: 'Second',
                    value: second
                },
                {
                    name: 'Mode',
                    value: mode
                },
                {
                    name: 'FirstSearchId',
                    value: firstsearchid
                },
                {
                    name: 'SecondSearchId',
                    value: secondsearchid
                }
            ]),
            {
                guildId: `${obj.guildId}`
            }
        )

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        let fieldFirst: Discord.EmbedField = {
            name: 'First',
            value: 'Loading...',
            inline: true
        }
        let fieldSecond: Discord.EmbedField = {
            name: 'Second',
            value: 'Loading...',
            inline: true
        }
        let fieldComparison: Discord.EmbedField = {
            name: 'Comparison',
            value: 'Loading...',
            inline: false
        }
        let embedTitle: string = 'w';
        let usefields: Discord.EmbedField[] = []
        try {
            if (second == null) {
                if (secondsearchid) {
                    const cuser = await osufunc.searchUser(secondsearchid, userdata, true);
                    second = cuser.username;
                    if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                        if (commandType != 'button') {
                            throw new Error('Second user not found')
                        }
                        return;
                    }
                } else {
                    if (osufunc.getPreviousId('user', `${obj.guildId}`) == null) {
                        throw new Error('Second user not found')
                    }
                    second = osufunc.getPreviousId('user', `${obj.guildId}`)
                }
            }
            if (first == null) {
                if (firstsearchid) {
                    const cuser = await osufunc.searchUser(firstsearchid, userdata, true);
                    first = cuser.username;
                    if (mode == null) {
                        mode = cuser.gamemode;
                    }
                    if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                        if (commandType != 'button') {
                            throw new Error('First user not found')
                        }
                        return;
                    }
                } else {
                    throw new Error('first user not found')
                }
            }

            let firstuser: osuApiTypes.User;
            if (func.findFile(first, 'osudata') &&
                !('error' in func.findFile(first, 'osudata')) &&
                button != 'Refresh'
            ) {
                firstuser = func.findFile(first, 'osudata')
            } else {
                firstuser = await osufunc.apiget('user', `${await first}`)
            }

            if (firstuser?.error) {
                if (commandType != 'button' && commandType != 'link') {
                    throw new Error('could not fetch first user data')

                }
                return;
            }

            let seconduser: osuApiTypes.User;
            if (func.findFile(second, 'osudata') &&
                !('error' in func.findFile(second, 'osudata')) &&
                button != 'Refresh'
            ) {
                seconduser = func.findFile(second, 'osudata')
            } else {
                seconduser = await osufunc.apiget('user', `${await second}`)
            }

            if (seconduser?.error) {
                if (commandType != 'button' && commandType != 'link') {
                    throw new Error('could not fetch second user data')
                }
                return;
            }

            func.storeFile(firstuser, firstuser.id, 'osudata')
            func.storeFile(firstuser, first, 'osudata')
            func.storeFile(seconduser, seconduser.id, 'osudata')
            func.storeFile(seconduser, second, 'osudata')


            switch (type) {
                case 'profile': {
                    embedTitle = 'Comparing profiles'
                    fieldFirst = {
                        name: `**${firstuser.username}**`,
                        value:
                            `**Rank:** ${func.separateNum(firstuser?.statistics.global_rank)}
**pp:** ${func.separateNum(firstuser?.statistics.pp)}
**Accuracy:** ${(firstuser?.statistics.hit_accuracy != null ? firstuser.statistics.hit_accuracy : 0).toFixed(2)}%
**Playcount:** ${func.separateNum(firstuser?.statistics.play_count)}
**Level:** ${func.separateNum(firstuser.statistics.level.current)}
`,
                        inline: true
                    };
                    fieldSecond = {
                        name: `**${seconduser.username}**`,
                        value:
                            `**Rank:** ${func.separateNum(seconduser?.statistics.global_rank)}
**pp:** ${func.separateNum(seconduser?.statistics.pp)}
**Accuracy:** ${(seconduser?.statistics.hit_accuracy != null ? seconduser.statistics.hit_accuracy : 0).toFixed(2)}%
**Playcount:** ${func.separateNum(seconduser?.statistics.play_count)}
**Level:** ${func.separateNum(seconduser.statistics.level.current)}
`,
                        inline: true
                    };
                    fieldComparison = {
                        name: `**Difference**`,
                        value:
                            `**Rank:** ${func.separateNum(Math.abs(firstuser.statistics.global_rank - seconduser.statistics.global_rank))}
**pp:** ${func.separateNum(Math.abs(firstuser?.statistics.pp - seconduser?.statistics.pp).toFixed(2))}
**Accuracy:** ${Math.abs((firstuser.statistics.hit_accuracy != null ? firstuser.statistics.hit_accuracy : 0) - (seconduser.statistics.hit_accuracy != null ? seconduser.statistics.hit_accuracy : 0)).toFixed(2)}%
**Playcount:** ${func.separateNum(Math.abs(firstuser.statistics.play_count - seconduser.statistics.play_count))}
**Level:** ${func.separateNum(Math.abs(firstuser.statistics.level.current - seconduser.statistics.level.current))}
`,
                        inline: false
                    }
                    usefields.push(fieldFirst, fieldSecond, fieldComparison)
                }
                    break;



                case 'top': {
                    const firsttopdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('best', `${firstuser.id}`, `${mode}`)
                    if (firsttopdata?.error) {
                        if (commandType != 'button' && commandType != 'link') {
                            throw new Error('could not fetch first user\'s top scores')
                        }
                        return;
                    }
                    const secondtopdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('best', `${seconduser.id}`, `${mode}`)
                    if (secondtopdata?.error) {
                        if (commandType != 'button' && commandType != 'link') {
                            throw new Error('could not fetch second user\'s top scores')
                        }
                        return;
                    }
                    let filterfirst = [];
                    //filter so that scores that have a shared beatmap id with the second user are kept
                    for (let i = 0; i < firsttopdata.length; i++) {
                        if (secondtopdata.find(score => score.beatmap.id == firsttopdata[i].beatmap.id)) {
                            filterfirst.push(firsttopdata[i])
                        }
                    }
                    filterfirst.sort((a, b) => b.pp - a.pp)
                    embedTitle = 'Comparing top scores'
                    let arrscore = [];
                    for (let i = 0; i < filterfirst.length; i++) {
                        const firstscore: osuApiTypes.Score = filterfirst[i]
                        const secondscore: osuApiTypes.Score = secondtopdata.find(score => score.beatmap.id == firstscore.beatmap.id)
                        if (secondscore == null) break;
                        const firstscorestr =
                        `\`${firstscore.pp.toFixed(2)}pp | ${(firstscore.accuracy * 100).toFixed(2)}% ${firstscore.mods.length > 0 ? '| +' + firstscore.mods.join('') : ''}`//.padEnd(30, ' ').substring(0, 30)
                        const secondscorestr =
                        `${secondscore.pp.toFixed(2)}pp | ${(secondscore.accuracy * 100).toFixed(2)}% ${secondscore.mods.length > 0 ? '| +' + secondscore.mods.join('') : ''}\`\n`//.padEnd(30, ' ').substring(0, 30)
                        arrscore.push(
                            `**[${firstscore.beatmapset.title} [${firstscore.beatmap.version}]](https://osu.ppy.sh/b/${firstscore.beatmap.id})**
\`${firstuser.username.padEnd(30, ' ').substring(0, 30)} | ${seconduser.username.padEnd(30, ' ').substring(0, 30)}\`
${firstscorestr.substring(0, 30)} | ${secondscorestr.substring(0, 30)}`
                        )
                    }

                    const scores = arrscore.length > 0 ? arrscore.slice(0, 5).join('\n') : 'No shared scores'
                    fieldFirst.value = scores
                    usefields.push(fieldFirst)
                }
                    break;



                case 'mapscore': {
                    embedTitle = 'Comparing map scores'
                    fieldFirst = {
                        name: `**${firstuser.username}**`,
                        value: '',
                        inline: true
                    }
                    fieldSecond = {
                        name: `**${seconduser.username}**`,
                        value: 's',
                        inline: true
                    }
                    fieldComparison = {
                        name: `**Difference**`,
                        value: 'w',
                        inline: false
                    }
                    usefields.push(fieldFirst, fieldSecond, fieldComparison)
                }
                    break;

            }
            osufunc.writePreviousId('user', obj.guildId, `${seconduser.id}`)
        } catch (error) {
            embedTitle = 'Error'
            usefields.push({
                name: 'Error',
                value: `${error}`,
                inline: false
            })
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle(embedTitle)
            .addFields(usefields)

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [embed],
                    files: [],
                    components: [],
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
                    files: [],
                    components: [],
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
                    embeds: [],
                    files: [],
                    components: [],
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