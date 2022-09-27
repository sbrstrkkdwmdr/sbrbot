import fs = require('fs');
import emojis = require('../../src/consts/emojis');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import Discord = require('discord.js');
import log = require('../../src/log');

module.exports = {
    name: 'localmapparse',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides) {
        let commanduser;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
            case 'link': {
                commanduser = obj.author;
            } break;
        }

        //==============================================================================================================================================================================================

        log.logFile(
            'command',
            log.commandLog('localmapparse', commandType, absoluteID, commanduser
            ),
            {
                guildId: `${obj.guildId}`
            })

        //OPTIONS==============================================================================================================================================================================================

        log.logFile('command',
            log.optsLog(absoluteID, []),
            {
                guildId: `${obj.guildId}`
            }
        )

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        let map: string = ''
        if (fs.existsSync('./files/tempdiff.osu')) {
            map = fs.readFileSync('./files/tempdiff.osu', 'utf-8')
        } else {
            return;
        }
        const errmap = fs.readFileSync('./files/errmap.osu', 'utf-8')
        let errtxt = '';
        let mods = 'NM'

        if (obj.content.includes('+')) {
            mods = obj.content.split('+')[1].split(' ')[0]
        }

        try {
            map.split('[HitObjects]')[1].split('\n')
        } catch (error) {
            errtxt += '\nError - invalid section: [HitObjects]'
        }
        let metadata;
        try {
            metadata = map.split('[Metadata]')[1].split('[')[0]
        } catch (error) {
            errtxt += '\nError - invalid section: [Metadata]'
            metadata = errmap.split('[Metadata]')[1].split('[')[0]
        }
        let ppcalcing;
        try {
            ppcalcing = await osufunc.mapcalclocal(mods, 'osu', null, 0)
        } catch (error) {
            ppcalcing = await osufunc.mapcalclocal(mods, 'osu', './files/errmap.osu', 0)
            errtxt += '\nError - pp calculations failed'
        }

        let general;
        let diff;
        try {
            general = map.split('[General]')[1].split('[')[0]
            diff = map.split('[Difficulty]')[1].split('[')[0]
        } catch (error) {
            errtxt += '\nError - invalid section: [General] or [Difficulty]'

            general = errmap.split('[General]')[1].split('[')[0]
            diff = errmap.split('[Difficulty]')[1].split('[')[0]
        }
        let title;
        let artist;
        let creator;
        let version;
        try {
            title = metadata.split('Title:')[1].split('\n')[0]
                ==
                metadata.split('Title:')[1].split('\n')[0]
                ?
                metadata.split('TitleUnicode:')[1].split('\n')[0] :
                `${metadata.split('Title:')[1].split('\n')[0]} (${metadata.split('TitleUnicode:')[1].split('\n')[0]})`
            artist = metadata.split('Artist:')[1].split('\n')[0]
                ==
                metadata.split('ArtistUnicode:')[1].split('\n')[0]
                ?
                metadata.split('ArtistUnicode:')[1].split('\n')[0] :
                `${metadata.split('Artist:')[1].split('\n')[0]} (${metadata.split('ArtistUnicode:')[1].split('\n')[0]})`

            creator = metadata.split('Creator:')[1].split('\n')[0]
            version = metadata.split('Version:')[1].split('\n')[0]
        } catch (error) {
            errtxt += '\nError - invalid section: [Metadata]'

            title = errmap.split('Title:')[1].split('\n')[0]
                == errmap.split('TitleUnicode:')[1].split('\n')[0] ?
                errmap.split('TitleUnicode:')[1].split('\n')[0] :
                `${errmap.split('Title:')[1].split('\n')[0]} (${errmap.split('TitleUnicode:')[1].split('\n')[0]})`
            artist = errmap.split('Artist:')[1].split('\n')[0]
                == errmap.split('ArtistUnicode:')[1].split('\n')[0] ?
                errmap.split('ArtistUnicode:')[1].split('\n')[0] :
                `${errmap.split('Artist:')[1].split('\n')[0]} (${errmap.split('ArtistUnicode:')[1].split('\n')[0]})`
            creator = errmap.split('Creator:')[1].split('\n')[0]
            version = errmap.split('Version:')[1].split('\n')[0]
        }
        const ftstr = `${artist} - ${title} [${version}] //${creator} ${mods ? `+${mods}` : ''}`
        let hitobjs;
        try {
            hitobjs = map.split('[HitObjects]')[1].split('\n')
        } catch (error) {
            errtxt += '\nError - invalid section: [HitObjects]'

            hitobjs = errmap.split('[HitObjects]')[1].split('\n')
        }
        let countcircle = 0
        let countslider = 0
        let countspinner = 0
        //to get count_circle, get every line without a |
        try {
            for (let i = 0; i < hitobjs.length; i++) {
                const curobj = hitobjs[i]
                if (curobj.includes('|')) {
                    countslider++
                } else if (curobj.split(',').length > 5) {
                    countspinner++
                } else {
                    countcircle++
                }
            }
        } catch (error) {
            errtxt += '\nError - invalid section: [HitObjects] (counting objects)'

            for (let i = 0; i < errmap.split('[HitObjects]')[1].split('\n').length; i++) {
                const curobj = errmap.split('[HitObjects]')[1].split('\n')[i]
                if (curobj.includes('|')) {
                    countslider++
                } else if (curobj.split(',').length > 5) {
                    countspinner++
                } else {
                    countcircle++
                }
            }
        }

        let firsttimep;
        let fintimep;
        try {
            firsttimep = hitobjs[1].split(',')[2]
            fintimep = hitobjs[hitobjs.length - 2].split(',')[2] //inaccurate cos of sliders n stuff
        } catch (error) {
            errtxt += '\nError - invalid section: [HitObjects] (getting object timings)'

            firsttimep = errmap.split('[HitObjects]')[1].split('\n')[1].split(',')[2]
            fintimep = errmap.split('[HitObjects]')[1].split('\n')[errmap.split('[HitObjects]').length - 2].split(',')[2] //inaccurate cos of sliders n stuff                                                                            
        }
        const mslen = parseInt(fintimep) - parseInt(firsttimep)

        const nlength = mslen / 1000
        const truelen = nlength > 60 ? // if length over 60
            nlength % 60 < 10 ? //if length over 60 and seconds under 10
                Math.floor(nlength / 60) + ':0' + Math.floor(nlength % 60) : //seconds under 10
                Math.floor(nlength / 60) + ':' + Math.floor(nlength % 60) //seconds over 10
            : //false
            nlength % 60 < 10 ? //length under 60 and 10
                '00:' + Math.floor(nlength) : //true
                '00:' + Math.floor(nlength) //false

        let bpm = NaN

        let timing;
        try {
            timing = map.split('[TimingPoints]')[1].split('[')[0]
        } catch (error) {
            errtxt += '\nError - invalid section: [TimingPoints]'

            timing = errmap.split('[TimingPoints]')[1].split('[')[0]
        }
        function pointToBPM(point: string) {
            const arr = point.split(',')
            //'a,b,c'
            //b is time in milliseconds between each beat
            //https://osu.ppy.sh/community/forums/topics/59274?n=4
            const bpm = 60000 / parseInt(arr[1])
            return bpm;
        }
        let totalpoints = 0
        let bpmmax = 0
        let bpmmin = 0
        for (let i = 0; i < timing.split('\n').length; i++) {
            const curpoint = timing.split('\n')[i]
            if (curpoint.includes(',')) {
                if (curpoint.includes('-')) {
                    break;
                }
                bpm = pointToBPM(curpoint)
                totalpoints++
                if (bpm > bpmmax) {
                    bpmmax = bpm
                }
                if (bpm < bpmmin || bpmmin == 0) {
                    bpmmin = bpm
                }
            }
        }
        const bpmavg = bpm / totalpoints

            ;
        let gm = '0'
        try {
            gm = general.split('Mode:')[1].split('\n')[0].replaceAll(' ', '')
        } catch (error) {
            gm = '0'
        }
        let strains;
        let mapgraph
        try {
            strains = await osufunc.straincalclocal(null, mods, 0, osumodcalc.ModeIntToName(parseInt(gm)))
        } catch (error) {
            errtxt += '\nError - strains calculation failed'

            strains = {
                strainTime: [0, 0],
                value: [0, 0]
            }

            strains = await osufunc.straincalclocal('./files/errmap.osu', mods, 0, osumodcalc.ModeIntToName(parseInt(gm)))

        }

        osufunc.debug(strains, 'fileparse', 'osu', obj.guildId, 'strains');
        try {
            mapgraph = await osufunc.graph(strains.strainTime, strains.value, 'Strains', null, null, null, null, null, 'strains')
        } catch (error) {
            obj.reply({
                content: 'Error - calculating strain graph.',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }
        let osuEmbed;
        try {
            osuEmbed = new Discord.EmbedBuilder()
                .setTitle(`${ftstr}`)
                .addFields([
                    {
                        name: 'MAP VALUES',
                        value:
                            `
CS${diff.split('CircleSize:')[1].split('\n')[0]} AR${diff.split('ApproachRate:')[1].split('\n')[0]} OD${diff.split('OverallDifficulty:')[1].split('\n')[0]} HP${diff.split('HPDrainRate:')[1].split('\n')[0]}
${emojis.mapobjs.circle}${countcircle}
${emojis.mapobjs.slider}${countslider}
${emojis.mapobjs.spinner}${countspinner}
${emojis.mapobjs.total_length}${truelen}
${emojis.mapobjs.bpm}${bpmmax.toFixed(2)} - ${bpmmin.toFixed(2)} (${bpmavg.toFixed(2)})
${errtxt.length > 0 ? `${errtxt}` : ''}
`,
                        inline: true
                    },
                    {
                        name: 'PP',
                        value:
                            `SS: ${ppcalcing[0].pp.toFixed(2)} \n ` +
                            `99: ${ppcalcing[1].pp.toFixed(2)} \n ` +
                            `98: ${ppcalcing[2].pp.toFixed(2)} \n ` +
                            `97: ${ppcalcing[3].pp.toFixed(2)} \n ` +
                            `96: ${ppcalcing[4].pp.toFixed(2)} \n ` +
                            `95: ${ppcalcing[5].pp.toFixed(2)} \n `,
                        inline: true
                    }
                ])
                .setImage(`${mapgraph}`)
        } catch (error) {
            obj.reply({
                content: 'Error - unknown',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [],
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
                    embeds: [],
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
            case 'link': {
                obj.reply({
                    content: '',
                    embeds: [osuEmbed],
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