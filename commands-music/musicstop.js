const { Track } = require("discord-player");
const {Player} = require('discord-player');
module.exports = {
    name: 'musicstop',
    description: '',
    async execute(message, args, client, Discord, ytdl, currentDate, currentDateISO) {
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
            console.log(error)
        }
console.log(`${currentDateISO} | ${currentDate}`)
console.log("executed command - musicstop")
let consoleloguserweeee = message.author
console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
console.log("")
}}