import fs = require('fs')
import fetch from 'node-fetch';
import ppcalc = require('booba')
import osucalc = require('osumodcalculator')
import { access_token } from '../../configs/osuauth.json';
import emojis = require('../../configs/emojis');
import cmdchecks = require('../../calc/commandchecks');
import osugame = require('../../calc/osugame');
import colours = require('../../configs/colours');

module.exports = {
    name: 'localmapparse',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let map: any = ''
        if (fs.existsSync('./files/tempdiff.osu')) {
            map = fs.readFileSync('./files/tempdiff.osu', 'utf-8')
        } else {
            return;
        }
        //console.log(map)

        let metadata = map.split('[Metadata]')[1].split('[')[0]

        if (metadata.includes('BeatmapID')) {
            let bid = metadata.split('BeatmapID')[1].split('\n')[0]
            if (parseInt(bid) != NaN) {
                //do osumaplink stuff
                let parse = null;
                let overrideID = cmdchecks.toAlphaNum(bid)
                await client.links.get('osumaplink').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, parse, overrideID);
                return;
            }
        }
        let ppcalcing = await osugame.mapcalclocal('NM', 'osu', null, 0)

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

        ftstr = `${artist} - ${title} [${version}] //${creator}`

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
        console.log(firsttimep)
        console.log(fintimep)

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

            ;


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
${emojis.mapobjs.bpm}${bpm}
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
                },
                {
                    name: 'Other',
                    value:
                        `
                        Audio Lead: ${general.split('AudioLeadIn:')[1].split('\n')[0]}| Audio Filename: ${general.split('Filename:')[1].split('\n')[0]}
                        Preview Timestamp: ${general.split('PreviewTime:')[1].split('\n')[0]} | Countdown: ${general.split('Countdown:')[1].split('\n')[0]}
                        Default sampleset:${general.split('SampleSet:')[1].split('\n')[0]} | Stack Leniency:${general.split('Leniency:')[1].split('\n')[0]}
                        Gamemode: ${general.split('Mode:')[1].split('\n')[0]} | 
                        Tags: ${metadata.split('Tags:')[1].split('\n')[0]}
                        Source: ${metadata.split('Source:')[1].split('\n')[0]}
                        Combo colours: ${combocolours}
                        `,
                    inline: false
                }
            ])
        message.reply({
            embeds: [osuEmbed],
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        })
    }
}