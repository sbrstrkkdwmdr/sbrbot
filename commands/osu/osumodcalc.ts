import fs = require('fs')
import osumodcalc = require('osumodcalculator')
module.exports = {
    name: 'osumodcalc',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button) {


        if (message != null) {
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - osumodcalc (message)\n${currentDate} | ${currentDateISO}\n recieved osumodcalc command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')

        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - osumodcalc (interaction)\n${currentDate} | ${currentDateISO}\n recieved osumodcalc command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            fs.appendFileSync(`commands.log`, `\nInteraction ID: ${interaction.id}`)
            let mods = interaction.options.getString('mods').toUpperCase();
            let baseCS = interaction.options.getNumber('cs')
            let baseAR = interaction.options.getNumber('ar')
            let baseOD = interaction.options.getNumber('od')
            let baseHP = interaction.options.getNumber('hp')
            let baseBPM = interaction.options.getNumber('bpm')

            let embed = new Discord.EmbedBuilder()

            if ((mods.includes("HR") && mods.includes("EZ")) || (mods.includes("HT") && (mods.includes("DT") || mods.includes("NC")))) {
                embed.setTitle("Error")
                embed.setDescription("You cannot have HR and EZ or HT and DT/NC at the same time.")
                interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
                return;
            }
            if (mods.includes("HR")) {
                baseCS *= 1.3 > 10 ? 10 : 1.3
                baseAR *= 1.4 > 10 ? 10 : 1.4
                baseOD *= 1.4 > 10 ? 10 : 1.4
                baseHP *= 1.4 > 10 ? 10 : 1.4
            }
            if (mods.includes("EZ")) {
                baseCS *= 0.5
                baseAR *= 0.5
                baseOD *= 0.5
                baseHP *= 0.5
            }
            if (mods.includes("HT")) {
                baseAR = osumodcalc.HalfTimeAR(baseAR).ar
                baseOD = osumodcalc.odHT(baseOD).od_num
                baseBPM *= 0.75
            }
            if (mods.includes("DT") || mods.includes("NC")) {
                baseAR = osumodcalc.DoubleTimeAR(baseAR).ar
                baseOD = osumodcalc.odDT(baseOD).od_num
                baseBPM *= 1.5
            }
            embed.setTitle(`Modded Details (${mods})`)
            embed.setDescription("**CS:** " + baseCS + "\n**AR:** " + baseAR + "\n**OD:** " + baseOD + "\n**HP:** " + baseHP + "\n**BPM:** " + baseBPM)
            interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
            fs.appendFileSync(`commands.log`, `\nsuccess - Interaction ID: ${interaction.id}\n\n`, 'utf-8')
            let endofcommand = new Date().getTime();
            let timeelapsed = endofcommand - currentDate.getTime();
            fs.appendFileSync(`commands.log`, `\nCommand Latency (interaction command => osumodcalc) - ${timeelapsed}ms\n`)
        }
    }
}