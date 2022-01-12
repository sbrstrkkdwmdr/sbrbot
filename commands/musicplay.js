const { Track } = require("discord-player");
let currentDate = new Date();
let currentDateISO = new Date().toISOString();
module.exports = {
    name: 'musicplay',
    description: '',
    async execute(message, args, client, Player, player, Discord, ytdl) {


      if (!message.member.voice.channelId) return await message.reply({ content: "You aren't in vc smh my head", ephemeral: true });
      if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId) return await message.reply({ content: "You aren't in vc smh my head", ephemeral: true });
      let queryget = args.splice(0,100).join(" ");
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
      queue

  console.log(`${currentDateISO} | ${currentDate}`)
  console.log("command executed - musicplay")
  let consoleloguserweeee = message.author
  console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
  console.log("")
}}