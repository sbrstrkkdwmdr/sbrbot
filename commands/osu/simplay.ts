import fs = require('fs');
import osuapiext = require('osu-api-extended');
import osumodcalc = require('osumodcalculator');

module.exports = {
    name: 'simplay',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button) {
        let absoluteID = currentDate.getTime()
        
        if (message != null) {
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            let embed = new Discord.EmbedBuilder()

                ;
            let x = args.join(' ');
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
            let mods = x.includes('+') ? osumodcalc.ModStringToInt(x.split('+')[1].split(' ')[0]) : 0;
            let miss = x.includes('miss') ? x.split('miss=')[1].split(' ')[0] : 0;
            let acc = x.includes('acc') ? x.split('acc=')[1].split(' ')[0] : 100.00;
            let combo = x.includes('combo') ? x.split('combo=')[1].split(' ')[0] : NaN;
            let simplay = await osuapiext.tools.pp.calculate(mapid, mods, combo, miss, acc);
            fs.writeFileSync('./debugosu/command-simulate.json', JSON.stringify(simplay, null, 2));

            try {
                let test = simplay.data.artist
            } catch(error) {
                embed
                .setTitle('There was an error calculating your play')
                .setDescription('Please make sure you entered the beatmap id not the map**set** id')

                message.reply({
                    embeds: [embed],
                    allowedMentions: { repliedUser: false },
                })
                return;
            }

            embed
                .setTitle(`Simulated play on ${simplay.data.artist} [${simplay.data.diff}]`)
                .setURL(`https://osu.ppy.sh/b/${mapid}`)
                .addFields([ //error
                    {
                        name: 'Map Details',
                        value: `
                ${parseFloat(acc).toFixed(2)}% | ${miss}x miss | ${combo}x/**${simplay.stats.combo}x** 
                ${osumodcalc.ModIntToString(mods)} | ${simplay.stats.star.pure}⭐
                CS${simplay.stats.cs} AR${simplay.stats.ar} HP${simplay.stats.hp} OD${simplay.stats.od}
                `, inline: true
                    },
                    {
                        name: 'Performance',
                        value:
                            `
\`Current: ${simplay.pp.current}pp | FC: ${simplay.pp.fc}pp 
SS: ${simplay.pp.acc['100']}pp   | 95: ${simplay.pp.acc['95']}pp\`
                        `,
                        inline: true
                    }
                ]
                )
                .setThumbnail(`${simplay.other.bg.list['2']}`)
            message.reply({
                embeds: [embed],
                allowedMentions: { repliedUser: false },
            })
            fs.writeFileSync(`./debugosu/prevmap${message.guildId}.json`, JSON.stringify({ id: mapid }, null, 2));

        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

            let buttons = new Discord.ActionRowBuilder()
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

        fs.appendFileSync(`commands.log`, '\nsuccess\n\n', 'utf-8')
    }
}