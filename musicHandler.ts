// import ytdl = require('youtube-mp3-downloader');
import ymp3 = require('ymp3d');
import fs = require('fs');
import checks = require('./src/checks');
import extypes = require('./src/types/extratypes');
import defaults = require('./src/consts/defaults');
import Discord = require('discord.js');
import DiscVoice = require('@discordjs/voice');
import yts = require('yt-search');

module.exports = (userdata, client, commandStruct, config, oncooldown) => {
    const y = new ymp3();
    let timeouttime;

    let connection;
    const player = DiscVoice.createAudioPlayer({
        behaviors: {
            noSubscriber: DiscVoice.NoSubscriberBehavior.Pause,
        },
    });
    let subscription;
    let queue = [];

    console.log(DiscVoice.generateDependencyReport());

    client.on('messageCreate', async (message) => {

        const currentDate = new Date();
        const absoluteID = currentDate.getTime();

        if (message.author.bot && !message.author.id == client.user.id) return;

        const currentGuildId = message.guildId
        let settings: extypes.guildSettings;
        try {
            const settingsfile = fs.readFileSync(`./config/guilds/${currentGuildId}.json`, 'utf-8')
            settings = JSON.parse(settingsfile);
        } catch (error) {
            fs.writeFileSync(`./config/guilds/${currentGuildId}.json`, JSON.stringify(defaults.defaultGuildSettings, null, 2), 'utf-8')
            settings = defaults.defaultGuildSettings;
        }

        if (!(message.content.startsWith(config.prefix) || message.content.startsWith(settings.prefix))) return; //the return is so if its just prefix nothing happens

        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        console.log(command);
        const interaction = null;
        const button = null;
        const obj = message;
        const overrides = null;
        switch (command) {
            case 'connect':
                if (!checkIsInVoice(message.member)) {
                    obj.reply({
                        content: 'You need to be in a voice channel to use this command',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                    return;
                } else {
                    voiceConnect(message.member.voice.channelId)
                    obj.reply({
                        content: 'Connected to voice channel',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                    console.log(client.guilds.cache.get(message.guildId).voiceStates.cache.get(client.user.id))
                }

                break;
            case 'play': {
                if (!checkIsInVoice(message.member)) {
                    obj.reply({
                        content: 'You need to be in a voice channel to use this command',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                    return;
                }
                if (!args[0]) {
                    obj.reply({
                        content: 'Please provide a song name or link',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                    return;
                } else {
                    const song = args.join(' ');
                    let songFin = song;
                    if (!song.includes('/')) {
                        const searching = await yts.search(song);
                        songFin = searching.videos[0].url;
                        if (!searching.videos[0].url) {
                            obj.reply({
                                content: 'Song not found',
                                allowedMentions: { repliedUser: false },
                                failIfNotExists: true
                            })
                            return;
                        }
                    }
                    // const voiceChannel = message.member.voice.channel;
                    await downloadAsMp3(songFin, message.member.voice.channelId);
                    obj.reply({
                        content: 'Song added to queue!',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                }
            }
                break;
            case 'disconnect':
                try {
                    disconnect(connection);
                    obj.reply({
                        content: 'Disconnected from voice channel',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    });
                } catch(error){
                    obj.reply({
                        content: 'I am not connected to a voice channel',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                }
                break;
        }
    });

    function checkIsInVoice(member: Discord.GuildMember) {
        if (member.voice.channel) {
            return true;
        }
        return false;
    }

    async function downloadAsMp3(url: string, channelId: string) {
        let init1 = url;

        if (url.includes('youtu.be')) {
            init1 = url.split('youtu.be/')[1]
        }



        const video = await y.Download(init1)

        y.on('start', function (commandLine) {
            console.log(commandLine)
        })

        y.on('progress', function (progress) {
            console.log(progress)
        })

        y.on('finish', function (fileName) {
            console.log(fileName)
            fs.rename(fileName, 'files/' + fileName, (err) => {
                if (err) { throw err } else {
                    console.log('Rename complete!');
                }
            });
            start('files/songs/' + fileName, channelId)
        })

        y.on('error', function (e) {
            console.log(e)
        })
    }



    async function voiceConnect(channelId: string) {
        const channel = client.channels.cache.get(channelId);
        console.log(channelId)
        console.log(channel.id)
        connection = DiscVoice.joinVoiceChannel({
            channelId: channelId,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
        connection.on(DiscVoice.VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
            try {
                await Promise.race([
                    DiscVoice.entersState(connection, DiscVoice.VoiceConnectionStatus.Signalling, 5_000),
                    DiscVoice.entersState(connection, DiscVoice.VoiceConnectionStatus.Connecting, 5_000),
                ]);
                // Seems to be reconnecting to a new channel - ignore disconnect
            } catch (error) {
                disconnect(connection);
            }
        });
        subscription = connection.subscribe(player);
        console.log('subscribed')
    }

    async function disconnect(connectionf: DiscVoice.VoiceConnection) {
        connectionf.destroy();
        console.log('Disconnected from channel');
    }

    async function start(resource: string, channelId: string) {
        player.play(DiscVoice.createAudioResource(resource));
        console.log(resource)
        queue.push(resource.replace('files/songs/', '').replace('.mp3', ''));
        voiceConnect(channelId);
        // const channel = client.channels.cache.get(channelId);
        // channel.send({
        //     content: 'Now playing: ' + queue[0],
        //     allowedMentions: { repliedUser: false },
        //     failIfNotExists: true
        // })
        try {
            await DiscVoice.entersState(player, DiscVoice.AudioPlayerStatus.Playing, 5_000);
            // The player has entered the Playing state within 5 seconds
            console.log('Playback has started!');            
        } catch (error) {
            // The player has not entered the Playing state and either:
            // 1) The 'error' event has been emitted and should be handled
            // 2) 5 seconds have passed
            console.error(error);
        }
    }

    async function quitPlayer() {
        player.stop();
        subscription.unsubscribe();
    }

    async function queueEnd(){
        //delete first element from array
        queue.shift();
    }

    // connection.on(DiscVoice.VoiceConnectionStatus.Ready, (oldState, newState) => {
    //     console.log('Connection is in the Ready state!');
    // });

    // player.on(DiscVoice.AudioPlayerStatus.Playing, (oldState, newState) => {
    //     console.log('Audio player is in the Playing state!');
    // });

}