const fs = require('fs')
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
            switch (command) {
                case 'leaderboard':case 'lb':
                    /*
                    'debugosu/maplb.json'
                    'debugosu/maplbmap.json'
                    */
                   message.channel.send({files: [`debugosu\\maplb.json`, `debugosu\\maplbmap.json`]})
                    break;
                case 'map':
                    /*
                    map.json
                    maptxt.json
                    */
                   message.channel.send({files: [`debugosu\\map.json`, `debugosu\\maptxt.json`]})
                    break;
                case 'osu':
                    /*
                    osu.json
                    */
                     message.channel.send({files: [`debugosu\\osu.json`]})
                    break;
                case 'osutop':
                    /*
                    osutop.json
                    osutopname.json
                    */
                    message.channel.send({files: [`debugosu\\osutop.json`, `debugosu\\osutopname.json`]})
                    break;
                case 'rs':case 'recent':
                    /*
                    rs.json
                    rspp.json
                    */
                    message.channel.send({files: [`debugosu\\rs.json`, `debugosu\\rspp.json`]})
                    break;
                case 'scores': case 'c':
                    /*
                    scores.json
                    scoresmap.json
                    scorespresort.json
                    */
                    message.channel.send({files: [`debugosu\\scores.json`, `debugosu\\scoresmap.json`, `debugosu\\scorespresort.json`]})
                    break;
                case 'score':
                /*
                scoreparse.json
                */
                message.channel.send({files: [`debugosu\\scoreparse.json`]})
                break;

                case 'replay': case 'replayparse':
                /*
                replay.json
                replaymap.json
                replayuser.json
                */
                message.channel.send({files: [`debugosu\\replay.json`, `debugosu\\replaymap.json`, `debugosu\\replayuser.json`]})
                break;

               case 'image':case 'imagesearch':
                /*
                image.json
                */
               message.channel.send('Cannot send image debug file - contains sensitive information')
                //message.channel.send({files: [`debug\\image.json`]})
                break;

               case 'yt':case 'ytsearch':
                /*
                ytsearch.json
                */
                message.channel.send({files: [`debug\\ytsearch.json`]})
               break;
               case 'time':
                /*
                timesince.txt
                */
                message.channel.send({files: [`debug\\timesince.txt`]})
                break;
            }
        }

    }
}