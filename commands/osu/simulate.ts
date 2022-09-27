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

module.exports = {
    name: 'simulate',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;
        let mapid = null;
        let mods = null;
        let acc = null;
        let combo = null;
        let n300 = null;
        let n100 = null;
        let n50 = null;
        let nMiss = null;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                const ctn = obj.content
                if (isNaN(+args[0])) {
                    mapid = +args[0]
                }
                if (ctn.includes('+')) {
                    mods = ctn.split('+')[1].split(' ')[0]
                }
                if (ctn.includes('mods=')) {
                    mods = ctn.split('mods=')[1].split(' ')[0]
                }
                if (ctn.includes('acc=')) {
                    acc = parseFloat(ctn.split('acc=')[1].split(' ')[0])
                }
                if (ctn.includes('accuracy=')) {
                    acc = parseFloat(ctn.split('accuracy=')[1].split(' ')[0])
                }
                if (ctn.includes('combo=')) {
                    combo = parseInt(ctn.split('combo=')[1].split(' ')[0])
                }
                if (ctn.includes('n300=')) {
                    n300 = parseInt(ctn.split('n300=')[1].split(' ')[0])
                }
                if (ctn.includes('300s=')) {
                    n300 = parseInt(ctn.split('300s=')[1].split(' ')[0])
                }
                if (ctn.includes('n100=')) {
                    n100 = parseInt(ctn.split('n100=')[1].split(' ')[0])
                }
                if (ctn.includes('100s=')) {
                    n100 = parseInt(ctn.split('100s=')[1].split(' ')[0])
                }
                if (ctn.includes('n50=')) {
                    n50 = parseInt(ctn.split('n50=')[1].split(' ')[0])
                }
                if (ctn.includes('50s=')) {
                    n50 = parseInt(ctn.split('50s=')[1].split(' ')[0])
                }
                if (ctn.includes('miss=')) {
                    nMiss = parseInt(ctn.split('miss=')[1].split(' ')[0])
                }
                if (ctn.includes('misses=')) {
                    nMiss = parseInt(ctn.split('misses=')[1].split(' ')[0])
                }
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                mapid = obj.options.getInteger('id')
                mods = obj.options.getString('mods')
                acc = obj.options.getNumber('accuracy')
                combo = obj.options.getInteger('combo')
                n300 = obj.options.getInteger('n300')
                n100 = obj.options.getInteger('n100')
                n50 = obj.options.getInteger('n50')
                nMiss = obj.options.getInteger('miss')
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
            log.commandLog('simulate', commandType, absoluteID, commanduser
            ),
            {
                guildId: `${obj.guildId}`
            })

        //OPTIONS==============================================================================================================================================================================================

        log.logFile('command',
            log.optsLog(absoluteID, [
                {
                    name: 'Map ID',
                    value: mapid
                },
                {
                    name: 'Mods',
                    value: mods
                },
                {
                    name: 'Accuracy',
                    value: acc
                },
                {
                    name: 'Combo',
                    value: combo
                },
                {
                    name: 'n300',
                    value: n300
                },
                {
                    name: 'n100',
                    value: n100
                },
                {
                    name: 'n50',
                    value: n50
                },
                {
                    name: 'Misses',
                    value: nMiss
                }
            ]),
            {
                guildId: `${obj.guildId}`
            }
        )

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (!mapid || isNaN(mapid)) {
            mapid = osufunc.getPreviousId('map', obj.guildId);
        }

        if (commandType == 'interaction') {
            obj.reply({ content: "Loading...", allowedMentions: { repliedUser: false } })
                .catch();

        }

        const mapdata: osuApiTypes.Beatmap = await osufunc.apiget('map', `${mapid}`)
        osufunc.debug(mapdata, 'command', 'map', obj.guildId, 'mapData');

        if (!mods) {
            mods = 'NM'
        }
        if (!combo) {
            combo = mapdata.max_combo
        }

        const score = await osufunc.scorecalc({
            mods,
            gamemode: 'osu',
            mapid,
            hit300: n300,
            hit100: n100,
            hit50: n50,
            miss: nMiss,
            acc,
            maxcombo: combo,
            score: null,
            calctype: 0,
            failed: false
        });
        osufunc.debug(score, 'command', 'simulate', obj.guildId, 'ppCalc');

        const fcaccgr =
            osumodcalc.calcgrade(
                n300,
                n100,
                n50,
                0
            )
        const specAcc = isNaN(fcaccgr.accuracy) ?
            acc ?
                acc :
                100 :
            fcaccgr.accuracy

        const mapPerf = await osufunc.mapcalc({
            mods,
            gamemode: 'osu',
            mapid,
            calctype: 0
        });

        const title = mapdata.beatmapset?.title ?
            mapdata.beatmapset?.title != mapdata.beatmapset?.title_unicode ?
                `${mapdata.beatmapset.title_unicode} (${mapdata.beatmapset.title}) [${mapdata.version}]` :
                `${mapdata.beatmapset.title_unicode} [${mapdata.version}]` :
            'unknown map'

        const scoreEmbed = new Discord.EmbedBuilder()
            .setTitle(`Simulated play on ${title}`)
            .setURL(`https://osu.ppy.sh/b/${mapid}`)
            .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg` || `https://osu.ppy.sh/images/layout/avatar-guest@2x.png`)
            .addFields([
                {
                    name: 'Score Details',
                    value:
                        `${acc ?? 100}% | ${nMiss ?? 0}x misses
${combo ?? mapdata.max_combo}x/**${mapdata.max_combo}**x
${mods ?? 'No mods'}
\`${n300}/${n100}/${n50}/${nMiss}\`
`,
                    inline: false
                },
                {
                    name: 'Performance',
                    value:
                        `
${score[0].pp?.toFixed(2)}pp | ${score[1].pp?.toFixed(2)}pp if ${(specAcc).toFixed(2)}% FC
SS: ${mapPerf[0].pp?.toFixed(2)}
99: ${mapPerf[1].pp?.toFixed(2)}
98: ${mapPerf[2].pp?.toFixed(2)}
97: ${mapPerf[3].pp?.toFixed(2)}
96: ${mapPerf[4].pp?.toFixed(2)}
95: ${mapPerf[5].pp?.toFixed(2)} 
`
                },
                {
                    name: 'Map Details',
                    value:
                        `
CS${mapdata.cs.toString().padEnd(5, ' ')}
AR${mapdata.ar.toString().padEnd(5, ' ')}
OD${mapdata.accuracy.toString().padEnd(5, ' ')}
HP${mapdata.drain.toString().padEnd(5, ' ')}
${emojis.mapobjs.total_length}${calc.secondsToTime(mapdata.total_length)}
                    `,
                    inline: true
                },
                {
                    name: '-',
                    value:
                        `
 ${emojis.mapobjs.circle}${mapdata.count_circles}
 ${emojis.mapobjs.slider}${mapdata.count_sliders}
 ${emojis.mapobjs.spinner}${mapdata.count_spinners}
 ${emojis.mapobjs.bpm}${mapdata.bpm}
                    `,
                    inline: true
                },
            ])

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [scoreEmbed],
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
                    obj.editReply({
                        content: '',
                        embeds: [scoreEmbed],
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