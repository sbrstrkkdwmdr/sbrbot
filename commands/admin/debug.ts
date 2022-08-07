import fs = require('fs')
module.exports = {
    name: 'debug',
    description: 'Returns debug files of certain commands',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {

        if (message != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - debug (message)\n${currentDate} | ${currentDateISO}\n recieved return debug file command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            let command = args[0]
            if (!args[0]) {
                return message.channel.send('Please specify a command to return debug files for.')
            }
            let debugfiles: string[] = [];
            let readfiles = fs.readdirSync('debugosu')
            switch (command) {
                case 'firsts':
                    for (let i = 0; i < readfiles.length; i++) {
                        if (readfiles[i].startsWith('command-firsts')) {
                            debugfiles.push('debugosu\\' + readfiles[i])
                        }
                    }
                    break;
                case 'leaderboard': case 'maplb': case 'mapleaderboard':
                    for (let i = 0; i < readfiles.length; i++) {
                        if (readfiles[i].startsWith('command-leaderboard')) {
                            debugfiles.push('debugosu\\' + readfiles[i])
                        }
                    }
                    break;
                case 'map': case 'm':
                    for (let i = 0; i < readfiles.length; i++) {
                        if (readfiles[i].startsWith('command-map')) {
                            debugfiles.push('debugosu\\' + readfiles[i])
                        }
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
                    for (let i = 0; i < readfiles.length; i++) {
                        if (readfiles[i].startsWith('link-map')) {
                            debugfiles.push('debugosu\\' + readfiles[i])
                        }
                    }
                    break;
                case 'osu': case 'o': case 'profile':
                    /*
                    osu.json
                    */
                    for (let i = 0; i < readfiles.length; i++) {
                        if (readfiles[i].startsWith('command-osu')) {
                            debugfiles.push('debugosu\\' + readfiles[i])
                        }
                    }
                    break;
                case 'osuparse': case 'osulink':
                    for (let i = 0; i < readfiles.length; i++) {
                        if (readfiles[i].startsWith('link-osu')) {
                            debugfiles.push('debugosu\\' + readfiles[i])
                        }
                    }
                    break;
                case 'osutop':
                    for (let i = 0; i < readfiles.length; i++) {
                        if (readfiles[i].startsWith('command-otop')) {
                            debugfiles.push('debugosu\\' + readfiles[i])
                        }
                    }
                    break;
                case 'pinned':
                    for (let i = 0; i < readfiles.length; i++) {
                        if (readfiles[i].startsWith('command-pinned')) {
                            debugfiles.push('debugosu\\' + readfiles[i])
                        }
                    }
                    break;
                case 'rs': case 'recent': case 'r':
                    for (let i = 0; i < readfiles.length; i++) {
                        if (readfiles[i].startsWith('command-rs')) {
                            debugfiles.push('debugosu\\' + readfiles[i])
                        }
                    }
                    break;
                case 'scores': case 'c':
                    for (let i = 0; i < readfiles.length; i++) {
                        if (readfiles[i].startsWith('command-scores')) {
                            debugfiles.push('debugosu\\' + readfiles[i])
                        }
                    }
                    break;
                case 'score': case 'scoreparse':
                    for (let i = 0; i < readfiles.length; i++) {
                        if (readfiles[i].startsWith('link-scoreparse')) {
                            debugfiles.push('debugosu\\' + readfiles[i])
                        }
                    }
                    break;

                case 'replay': case 'replayparse':
                    /*
                    link-replay.json
                    link-replaymap.json
                    link-replayuser.json
                    */
                    for (let i = 0; i < readfiles.length; i++) {
                        if (readfiles[i].startsWith('link-replay')) {
                            debugfiles.push('debugosu\\' + readfiles[i])
                        }
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