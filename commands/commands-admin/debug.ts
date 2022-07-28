import fs = require('fs')
module.exports = {
    name: 'debug',
    description: 'Returns debug files of certain commands',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {

        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - debug (message)\n${currentDate} | ${currentDateISO}\n recieved return debug file command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            let command = args[0]
            if (!args[0]) {
                return message.channel.send('Please specify a command to return debug files for.')
            }
            let debugfiles: string[] = [];
            switch (command) {
                case 'leaderboard': case 'lb':
                    /*
                    'debugosu/command-maplb.json'
                    'debugosu/command-maplbmap.json'
                    'debugosu/command-maplbapiv1.json'
                    'debugosu/command-maplbscores.txt'
                    */
                    if (fs.existsSync('debugosu/command-maplb.json')) {
                        debugfiles.push('debugosu\\command-maplb.json')
                    }
                    if (fs.existsSync('debugosu/command-maplbmap.json')) {
                        debugfiles.push('debugosu\\command-maplbmap.json')
                    }
                    if (fs.existsSync('debugosu/command-maplbapiv1.json')) {
                        debugfiles.push('debugosu\\command-maplbapiv1.json')
                    }
                    if (fs.existsSync('debugosu/command-maplbscores.txt')) {
                        debugfiles.push('debugosu\\command-maplbscores.txt')
                    }
                    break;
                case 'map':case 'm':
                    /*
                    map.json
                    maptxt.json
                    mapppcalc.json
                    mapppcalc95.json
                    mapattrdata.json

                    */
                    if (fs.existsSync('debugosu/command-map.json')) {
                        debugfiles.push('debugosu\\command-map.json')
                    }
                    if (fs.existsSync('debugosu/command-maptxt.json')) {
                        debugfiles.push('debugosu\\maptxt.json')
                    }
                    if (fs.existsSync('debugosu/command-mapppcalc.json')) {
                        debugfiles.push('debugosu\\command-mapppcalc.json')
                    }
                    if (fs.existsSync('debugosu/command-mapppcalc95.json')) {
                        debugfiles.push('debugosu\\command-mapppcalc95.json')
                    }
                    if (fs.existsSync('debugosu/command-mapattrdata.json')) {
                        debugfiles.push('debugosu\\command-mapattrdata.json')
                    }
                    break;
                case 'mapparse': case 'maplink':
                    /*
                    link-map.json
                    link-mapppcalc.json
                    link-mapppcalc95.json
                    link-mapattrdata.json
                    link-setdata.json
                    */
                    if (fs.existsSync('debugosu/link-map.json')) {
                        debugfiles.push('debugosu\\link-map.json')
                    }
                    if (fs.existsSync('debugosu/link-mapppcalc.json')) {
                        debugfiles.push('debugosu\\link-mapppcalc.json')
                    }
                    if (fs.existsSync('debugosu/link-mapppcalc95.json')) {
                        debugfiles.push('debugosu\\link-mapppcalc95.json')
                    }
                    if (fs.existsSync('debugosu/link-mapattrdata.json')) {
                        debugfiles.push('debugosu\\link-mapattrdata.json')
                    }
                    if (fs.existsSync('debugosu/link-setdata.json')) {
                        debugfiles.push('debugosu\\link-setdata.json')
                    }
                    break;
                case 'osu': case 'o': case 'profile':
                    /*
                    osu.json
                    */
                    if (fs.existsSync('debugosu/command-osu.json')) {
                        debugfiles.push('debugosu\\command-osu.json')
                    }
                    break;
                case 'osuparse': case 'osulink':
                    /*
                    link-osu.json
                    */
                    if (fs.existsSync('debugosu/link-osu.json')) {
                        debugfiles.push('debugosu\\link-osu.json')
                    }
                    break;
                case 'osutop':
                    /*
                    osutop.json
                    osutopname.json
                    */
                    if (fs.existsSync('debugosu/command-osutop.json')) {
                        debugfiles.push('debugosu\\command-osutop.json')
                    }
                    if (fs.existsSync('debugosu/command-osutopname.json')) {
                        debugfiles.push('debugosu\\command-osutopname.json')
                    }
                    break;
                case 'rs': case 'recent':
                    /*
                    rs.json
                    rspp.json
                    rsattrdata.json
                    */
                    if (fs.existsSync('debugosu/command-rs.json')) {
                        debugfiles.push('debugosu\\command-rs.json')
                    }
                    if (fs.existsSync('debugosu/command-rspp.json')) {
                        debugfiles.push('debugosu\\command-rspp.json')
                    }
                    if (fs.existsSync('debugosu/command-rsattrdata.json')) {
                        debugfiles.push('debugosu\\command-rsattrdata.json')
                    }
                    break;
                case 'scores': case 'c':
                    /*
                    scores.json
                    scoresmap.json
                    scorespresort.json
                    */
                    if (fs.existsSync('debugosu/command-scores.json')) {
                        debugfiles.push('debugosu\\command-scores.json')
                    }
                    if (fs.existsSync('debugosu/command-scoresmap.json')) {
                        debugfiles.push('debugosu\\command-scoresmap.json')
                    }
                    if (fs.existsSync('debugosu/command-scorespresort.json')) {
                        debugfiles.push('debugosu\\command-scorespresort.json')
                    }
                    break;
                case 'score': case 'scoreparse':
                    /*
                    link-scoreparse.json
                    */
                    if (fs.existsSync('debugosu/link-scoreparse.json')) {
                        debugfiles.push('debugosu\\link-scoreparse.json')
                    }
                    break;

                case 'replay': case 'replayparse':
                    /*
                    link-replay.json
                    link-replaymap.json
                    link-replayuser.json
                    */
                    if (fs.existsSync('debugosu/link-replay.json')) {
                        debugfiles.push('debugosu\\link-replay.json')
                    }
                    if (fs.existsSync('debugosu/link-replaymap.json')) {
                        debugfiles.push('debugosu\\link-replaymap.json')
                    }
                    if (fs.existsSync('debugosu/link-replayuser.json')) {
                        debugfiles.push('debugosu\\link-replayuser.json')
                    }
                    break;

                case 'image': case 'imagesearch':
                    /*
                    image.json
                    */
                    return message.reply({ content: 'Cannot send image debug file - contains sensitive information', allowedMentions: { repliedUser: false } })
                    //message.channel.send({files: [`debug\\image.json`]})
                    break;

                case 'yt': case 'ytsearch':
                    /*
                    ytsearch.json
                    */
                    if (fs.existsSync('debug/ytsearch.json')) {
                        debugfiles.push('debug\\ytsearch.json')
                    }
                    break;
                case 'time':
                    /*
                    timesince.txt
                    */
                    if (fs.existsSync('debug/timesince.txt')) {
                        debugfiles.push('debug\\timesince.txt')
                    }
                    break;
            }
            if (debugfiles.length > 0) {

                message.reply({ files: debugfiles, allowedMentions: { repliedUser: false } })
            }
            else {
                message.reply({ content: `error - no files found for \`${args.join(' ')}\``, allowedMentions: { repliedUser: false } })
            }
        }

    }
}