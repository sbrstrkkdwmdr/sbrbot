import fs = require('fs')
import fetch from 'node-fetch';
import ppcalc = require('booba')
import osucalc = require('osumodcalculator')
import { access_token } from '../../configs/osuauth.json';
import emojis = require('../../configs/emojis');
import cmdchecks = require('../../calc/commandchecks');
import osufunc = require('../../calc/osufunc');
import colours = require('../../configs/colours');

module.exports = {
    name: 'localmapparse',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
            `
----------------------------------------------------
LINK PARSE EVENT - local map parse
${currentDate} | ${currentDateISO}
recieved \`.osu\` file
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        let map: any = ''
        if (fs.existsSync('./files/tempdiff.osu')) {
            map = fs.readFileSync('./files/tempdiff.osu', 'utf-8')
        } else {
            return;
        }
        let mods = 'NM'
        if (message.content.includes('+')) {
            mods = message.content.split('+')[1].split(' ')[0]
        }

        try {
            let hitobjs = map.split('[HitObjects]')[1].split('\n')
        } catch (error) {
            message.reply({
                content: 'Error - empty or invalid .osu file',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }
        let metadata = map.split('[Metadata]')[1].split('[')[0]

        if (metadata.includes('BeatmapID')) {
            let bid = metadata.split('BeatmapID')[1].split('\n')[0]
            if (parseInt(bid) != NaN && parseInt(bid) > 0) {
                let parse = null;
                let overrideID = cmdchecks.toAlphaNum(bid)
                fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Beatmap ID detected => moving to osumaplinkparse
bid: ${bid}
overrideID: ${overrideID}
----------------------------------------------------
`, 'utf-8')
                await client.links.get('osumaplink').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, parse, overrideID);
                return;
            }
        }
        let ppcalcing = await osufunc.mapcalclocal(mods, 'osu', null, 0)

        let ftstr: string;

        let general = map.split('[General]')[1].split('[')[0]

        let diff = map.split('[Difficulty]')[1].split('[')[0]

        let title = metadata.split('Title:')[1].split('\n')[0]
            ==
            metadata.split('Title:')[1].split('\n')[0]
            ?
            metadata.split('TitleUnicode:')[1].split('\n')[0] :
            `${metadata.split('Title:')[1].split('\n')[0]} (${metadata.split('TitleUnicode:')[1].split('\n')[0]})`
        let artist = metadata.split('Artist:')[1].split('\n')[0]
            ==
            metadata.split('ArtistUnicode:')[1].split('\n')[0]
            ?
            metadata.split('ArtistUnicode:')[1].split('\n')[0] :
            `${metadata.split('Artist:')[1].split('\n')[0]} (${metadata.split('ArtistUnicode:')[1].split('\n')[0]})`

        let creator = metadata.split('Creator:')[1].split('\n')[0]
        let version = metadata.split('Version:')[1].split('\n')[0]

        ftstr = `${artist} - ${title} [${version}] //${creator} ${mods ? `+${mods}` : ''}`

        let hitobjs = map.split('[HitObjects]')[1].split('\n')
        let countcircle = 0
        let countslider = 0
        let countspinner = 0
        //to get count_circle, get every line without a |
        for (let i = 0; i < hitobjs.length; i++) {
            let curobj = hitobjs[i]
            if (curobj.includes('|')) {
                countslider++
            } else if (curobj.split(',').length > 5) {
                countspinner++
            } else {
                countcircle++
            }
        }
        let firsttimep = hitobjs[1].split(',')[2]
        let fintimep = hitobjs[hitobjs.length - 2].split(',')[2] //inaccurate cos of sliders n stuff

        let mslen = parseInt(fintimep) - parseInt(firsttimep)

        let nlength = mslen / 1000
        let truelen = nlength > 60 ? // if length over 60
            nlength % 60 < 10 ? //if length over 60 and seconds under 10
                Math.floor(nlength / 60) + ':0' + Math.floor(nlength % 60) : //seconds under 10
                Math.floor(nlength / 60) + ':' + Math.floor(nlength % 60) //seconds over 10
            : //false
            nlength % 60 < 10 ? //length under 60 and 10
                '00:' + Math.floor(nlength) : //true
                '00:' + Math.floor(nlength) //false

        let combocolours = []
        let colours = map.split('[Colours]')[1].split('[')[0].split('\n')

        for (let i = 0; i < colours.length; i++) {

            try {
                let curstr = colours[i].split(`Combo${i + 1}`)[1].replaceAll(' ', '')
                combocolours.push(curstr)
            } catch (err) {
                break;
            }
        }

        let bpm = NaN

        let timing = map.split('[TimingPoints]')[1].split('[')[0]

        function pointToBPM(point: string) {
            let arr = point.split(',')
            //'a,b,c'
            //b is time in milliseconds between each beat
            //https://osu.ppy.sh/community/forums/topics/59274?n=4
            let bpm = 60000 / parseInt(arr[1])
            return bpm;
        }
        let totalpoints = 0
        let bpmmax = 0
        let bpmmin = 0
        for (let i = 0; i < timing.split('\n').length; i++) {
            let curpoint = timing.split('\n')[i]
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
        let bpmavg = bpm / totalpoints

            ;
        let gm = general.split('Mode:')[1].split('\n')[0].replaceAll(' ', '')
        let strains = await osufunc.straincalclocal(null, mods, 0, osucalc.ModeIntToName(parseInt(gm)))
        //fs.writeFileSync(`./debugosu/link-maplocal=strains=${obj.guildId}.json`, JSON.stringify(strains, null, 2))

        let mapgraph = await osufunc.graph(strains.strainTime, strains.value, 'Strains', null, null, null, null, null, 'strains')


        let osuEmbed = new Discord.EmbedBuilder()
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

        message.reply({
            embeds: [osuEmbed],
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        }).catch(error => {

        })
        fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Success
----------------------------------------------------
`, 'utf-8')
    }
}