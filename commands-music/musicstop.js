const { Track } = require("discord-player");
const {Player} = require('discord-player');
const fs = require('fs')
module.exports = {
    name: 'musicstop',
    description: 'WIP',
    async execute(message, args, client, Discord, ytdl, currentDate, currentDateISO) {
        fs.appendFileSync('checker.log', "\n" + '--- COMMAND EXECUTION ---')
        const player = new Player(client);

        try {if (!message.member.voice.channelId) return await message.reply({ content: "You aren't in vc smh my head", ephemeral: true });
        if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId) return await message.reply({ content: "You aren't in vc smh my head", ephemeral: true });
        let queryget = ("https://www.youtube.com/watch?v=_WXNeFygGME");
        const query = queryget;
        const queue = player.createQueue(message.guild, {
            metadata: {
                channel: message.channel
            }
        });
        
        // verify vc connection
        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch (error) {
            queue.destroy();
            return await message.reply({ content: "Can't join this vc", ephemeral: true });
        }
  
        
        const track = await player.search(query, {
            requestedBy: message.user
        }).then(x => x.tracks[0]);
        if (!track) return await message.followUp({ content: `❌ | **${query}** not found` });
  
        queue.addTrack(track);
        message.reply("Added " + track + " to the queue | url: " + track.url)
        message.channel.send("current queue: " + queue)
        queue.play();
        queue} catch(error){
            message.reply("error")
            fs.appendFileSync('checker.log', "\n" + error)
        }
fs.appendFileSync('checker.log', "\n" + `${currentDateISO} | ${currentDate}`)
fs.appendFileSync('checker.log', "\n" + "executed command - musicstop")
fs.appendFileSync('checker.log', "\n" + "category - music")
let consoleloguserweeee = message.author
fs.appendFileSync('checker.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
fs.appendFileSync('checker.log', "\n" + "")
console.groupEnd()
}}