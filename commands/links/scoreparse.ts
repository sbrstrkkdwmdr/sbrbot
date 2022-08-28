import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import calc = require('../../calc/calculations');
import emojis = require('../../configs/emojis');
import colours = require('../../configs/colours');
import osufunc = require('../../calc/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../configs/osuApiTypes');


module.exports = {
    name: 'scoreparse',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let commanduser;
        let baseCommandType;

        let scorelink: string;
        let scoremode: string;
        let scoreid: number | string;

        if (message != null && interaction == null && button == null) {
            commanduser = message.author;
            baseCommandType = 'message';
            const messagenohttp = message.content.replace('https://', '').replace('http://', '').replace('www.', '')
            try {
                scorelink = messagenohttp.split('/scores/')[1]
                scoremode = scorelink.split('/')[0]
                scoreid = scorelink.split('/')[1]
            } catch (error) {
                return;
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            commanduser = interaction.member.user;
            baseCommandType = 'interaction';
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            commanduser = interaction.member.user;
            baseCommandType = 'button';
        }

        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-scoreparse-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('⬅')
                    /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-scoreparse-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-scoreparse-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('▶')
                    /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-scoreparse-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('➡')
                    /* .setLabel('End') */,
            );
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
COMMAND EVENT - scoreparse (${baseCommandType})
${currentDate} | ${currentDateISO}
recieved scoreparse command
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
    mode: ${scoremode}
    scoreid: ${scoreid}
----------------------------------------------------
`, 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        const scoredata: osuApiTypes.Score = await osufunc.apiget('score', `${scoreid}`, `${scoremode}`)
        try {
            if (typeof scoredata?.error != 'undefined') {
                obj.reply({ content: 'This score is unsubmitted/failed/invalid and cannot be parsed', allowedMentions: { repliedUser: false } })
                    .catch();
                return;
            }
        } catch (error) {
        }

        fs.writeFileSync(`debugosu/command-scoreparse=scoredata=${obj.guildId}.json`, JSON.stringify(scoredata, null, 2));
        try {
            scoredata.rank.toUpperCase();
        } catch (error) {
            obj.reply({ content: 'This score is unsubmitted/failed/invalid and cannot be parsed', allowedMentions: { repliedUser: false } })
                .catch();
            return;
        }
        const mapdata = await osufunc.apiget('map', `${scoredata.beatmap.id}`)
        fs.appendFileSync('debugosu/command-scoreparse=map.json', JSON.stringify(mapdata, null, 2));

        const ranking = scoredata.rank ? scoredata.rank : 'f'
        let scoregrade = emojis.grades.F
        switch (ranking.toUpperCase()) {
            case 'F':
                scoregrade = emojis.grades.F
                break;
            case 'D':
                scoregrade = emojis.grades.D
                break;
            case 'C':
                scoregrade = emojis.grades.C
                break;
            case 'B':
                scoregrade = emojis.grades.B
                break;
            case 'A':
                scoregrade = emojis.grades.A
                break;
            case 'S':
                scoregrade = emojis.grades.S
                break;
            case 'SH':
                scoregrade = emojis.grades.SH
                break;
            case 'X':
                scoregrade = emojis.grades.X
                break;
            case 'XH':
                scoregrade = emojis.grades.XH

                break;
        }
        const gamehits = scoredata.statistics

        const mode = scoredata.mode
        // let ppfc: any;
        let hitlist: string;
        let fcacc: number;
        // let ppiffc: any;
        let ppissue: string;

        if (mode == 'osu') {
            hitlist = `${gamehits.count_300}/${gamehits.count_100}/${gamehits.count_50}/${gamehits.count_miss}`
            fcacc = osumodcalc.calcgrade(gamehits.count_300, gamehits.count_100, gamehits.count_50, gamehits.count_miss).accuracy
        }
        if (mode == 'taiko') {
            hitlist = `${gamehits.count_300}/${gamehits.count_100}/${gamehits.count_miss}`
            fcacc = osumodcalc.calcgradeTaiko(gamehits.count_300, gamehits.count_100, gamehits.count_miss).accuracy

        }
        if (mode == 'fruits') {
            hitlist = `${gamehits.count_300}/${gamehits.count_100}/${gamehits.count_50}/${gamehits.count_miss}`
            fcacc = osumodcalc.calcgradeCatch(gamehits.count_300, gamehits.count_100, gamehits.count_50, gamehits.count_katu, gamehits.count_miss).accuracy
        }
        if (mode == 'mania') {
            hitlist = `${gamehits.count_geki}/${gamehits.count_300}/${gamehits.count_katu}/${gamehits.count_100}/${gamehits.count_50}/${gamehits.count_miss}`
            fcacc = osumodcalc.calcgradeMania(gamehits.count_geki, gamehits.count_300, gamehits.count_katu, gamehits.count_100, gamehits.count_50, gamehits.count_miss).accuracy
        }
        let ppcalcing;
        try {
            ppcalcing = await osufunc.scorecalc(scoredata.mods.join('').length > 1 ? scoredata.mods.join('') : 'NM', scoredata.mode, scoredata.beatmap.id, gamehits.count_geki, gamehits.count_300, gamehits.count_katu, gamehits.count_100, gamehits.count_50, gamehits.count_miss, scoredata.accuracy * 100, scoredata.max_combo, scoredata.score, 0, null, false)
            ppissue = ''
            fs.writeFileSync(`debugosu/command-scoreparse=ppcalc=${obj.guildId}.json`, JSON.stringify(ppcalcing, null, 2));
        } catch (error) {
            ppcalcing = [{
                pp: 0.000
            }, {
                pp: 0.000
            }]
            ppissue = 'Error - pp calculator could not fetch beatmap'
            fs.appendFileSync(`logs/cmd/commands${message.guildId}.log`, 'ERROR CALCULATING PERFORMANCE: ' + error)

        }

        let artist = scoredata.beatmapset.artist
        const artistuni = scoredata.beatmapset.artist_unicode
        let title = scoredata.beatmapset.title
        const titleuni = scoredata.beatmapset.title_unicode

        if (artist != artistuni) {
            artist = `${artist} (${artistuni})`
        }

        if (title != titleuni) {
            title = `${title} (${titleuni})`
        }
        let pptxt = `${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC`

        if (scoredata.accuracy == 1) {
            if (scoredata.perfect == true) {
                pptxt = `${ppcalcing[0].pp.toFixed(2)}pp`
            } else {
                pptxt = `${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC`
            }
        } else {
            if (scoredata.perfect == true) {
                pptxt = `${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[2].pp.toFixed(2)}pp if SS`
            } else {
                pptxt = `${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC | ${ppcalcing[2].pp.toFixed(2)}pp if SS`
            }
        }

        const scoreembed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.score.hex)
            .setAuthor({ name: `${scoredata.user.username}`, iconURL: `https://a.ppy.sh/${scoredata.user.id}`, url: `https://osu.ppy.sh/users/${scoredata.user.id}` })
            .setTitle(`${artist} - ${title}`)
            .setURL(`https://osu.ppy.sh/b/${scoredata.beatmap.id}`)
            .setThumbnail(`${scoredata.beatmapset.covers['list@2x']}`)
            .setDescription(`
${(scoredata.accuracy * 100).toFixed(2)}% | ${scoregrade}

\`${hitlist}\`
${scoredata.max_combo}x
${pptxt}\n${ppissue}
`)
        //SEND/EDIT MSG==============================================================================================================================================================================================

        if ((message != null || interaction != null) && button == null) {
            obj.reply({
                content: '',
                embeds: [scoreembed],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch();

        }
        if (button != null) {
            message.edit({
                content: '',
                embeds: [scoreembed],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch();

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