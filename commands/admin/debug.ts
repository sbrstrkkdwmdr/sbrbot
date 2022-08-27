import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
module.exports = {
    name: 'debug',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let command;
        const debugfiles = [];
        const readfiles = fs.readdirSync('debugosu')
        let commanduser;

        if (message != null && interaction == null && button == null) {
            commanduser = message.author
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - debug (message)
${currentDate} | ${currentDateISO}
recieved debug command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            command = args[0]
            if (!args[0]) {
                message.reply({
                    content: 'Error - no command specified',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch(error => { });
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            commanduser = interaction.member.user
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - debug (interaction)
${currentDate} | ${currentDateISO}
recieved debug command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            command = interaction.options.getString('command')
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            commanduser = interaction.member.user
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - debug (interaction)
${currentDate} | ${currentDateISO}
recieved debug command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }
        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}
commmand: ${command}
----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        if(!(cmdchecks.isAdmin(commanduser.id, obj.guild, client) || cmdchecks.isOwner(commanduser.id))) {
            obj.reply({
                content: 'Error - you do not have permission to use this command',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });
        }
        
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
                return obj.reply({ content: 'Cannot send image debug file - contains sensitive information', allowedMentions: { repliedUser: false } })
                    .catch(error => { });

            case 'yt': case 'ytsearch':
                /*
                ytsearch.json
                */
                if (fs.existsSync('debug/ytsearch.json')) {
                    debugfiles.push('debug\\ytsearch.json')
                }
                break;
        }

        if (debugfiles.length > 0 && debugfiles.length < 11) {
            if ((message != null || interaction != null) && button == null) {
                obj.reply({
                    files: debugfiles,
                    allowedMentions: { repliedUser: false },
                    failIfNotExits: true
                })
                    .catch(error => { 
                        console.log(error)
                    });

            }
/*             if (button != null) {

            } */
        } else if (debugfiles.length >= 10 ) {
            if ((message != null || interaction != null) && button == null) {
                obj.reply({
                    content: 'Too many debug files to send.\nSplitting into multiple messages...',
                    allowedMentions: { repliedUser: false },
                    failIfNotExits: true
                }).catch(error => { });
                //for every 10 files, make a new array and send it
                
                for (let i = 0; i < debugfiles.length; i++) {
                    if (i % 10 == 0) {
                        obj.channel.send({
                            files: debugfiles.slice(i, i + 10),
                            allowedMentions: { repliedUser: false },
                            failIfNotExits: true
                        })
                            .catch(error => { 
                                console.log(error)
                            });
                    }
                }

            }
/*             if (button != null) {

            } */
        }
        else {
            if ((message != null || interaction != null) && button == null) {
                obj.reply({
                    content: 'No debug files found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExits: true
                })
                    .catch(error => { });

            }
        }
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
success
ID: ${absoluteID}
files: ${debugfiles}
\n\n`, 'utf-8')
    }
}