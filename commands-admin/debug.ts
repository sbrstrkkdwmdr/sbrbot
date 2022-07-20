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
            let debugfiles;
            switch (command) {
                case 'leaderboard': case 'lb':
                    /*
                    'debugosu/maplb.json'
                    'debugosu/maplbmap.json'
                    */
                    debugfiles = [`debugosu\\maplb.json`, `debugosu\\maplbmap.json`]
                    break;
                case 'map':
                    /*
                    map.json
                    maptxt.json
                    */
                    debugfiles = [`debugosu\\map.json`, `debugosu\\maptxt.json`]
                    break;
                case 'osu':
                    /*
                    osu.json
                    */
                    debugfiles = [`debugosu\\osu.json`]
                    break;
                case 'osutop':
                    /*
                    osutop.json
                    osutopname.json
                    */
                    debugfiles = [`debugosu\\osutop.json`, `debugosu\\osutopname.json`]
                    break;
                case 'rs': case 'recent':
                    /*
                    rs.json
                    rspp.json
                    */
                    debugfiles = [`debugosu\\rs.json`, `debugosu\\rspp.json`]
                    break;
                case 'scores': case 'c':
                    /*
                    scores.json
                    scoresmap.json
                    scorespresort.json
                    */
                    debugfiles = [`debugosu\\scores.json`, `debugosu\\scoresmap.json`, `debugosu\\scorespresort.json`]
                    break;
                case 'score':
                    /*
                    scoreparse.json
                    */
                    debugfiles = [`debugosu\\scoreparse.json`]
                    break;

                case 'replay': case 'replayparse':
                    /*
                    replay.json
                    replaymap.json
                    replayuser.json
                    */
                    debugfiles = [`debugosu\\replay.json`, `debugosu\\replaymap.json`, `debugosu\\replayuser.json`]
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
                    debugfiles = [`debug\\ytsearch.json`]
                    break;
                case 'time':
                    /*
                    timesince.txt
                    */
                    debugfiles = [`debug\\timesince.txt`]
                    break;
                default:
                    message.reply({ content: 'error - no file found', allowedMentions: { repliedUser: false } })
                    break;
            }
            message.reply({ files: debugfiles, allowedMentions: { repliedUser: false } })
        }

    }
}