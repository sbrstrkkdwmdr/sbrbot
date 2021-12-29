module.exports = {
    name: 'musicplay',
    description: '',
    async execute(message, args, client, Player, player, Discord, ytdl, currentDate, currentDateISO) {


      if (!message.member.voice.channelId) return await message.reply({ content: "You are not in a voice channel!", ephemeral: true });
      if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId) return await message.reply({ content: "You are not in my voice channel!", ephemeral: true });
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
      } catch {
          queue.destroy();
          return await message.reply({ content: "Could not join your voice channel!", ephemeral: true });
      }

      
      const track = await player.search(query, {
          requestedBy: message.user
      }).then(x => x.tracks[0]);
      if (!track) return await message.followUp({ content: `❌ | Track **${query}** not found!` });

      queue.play(track);

  console.log(`${currentDateISO} | ${currentDate}`)
  console.log("command executed - musicplay")
  let consoleloguserweeee = message.author
  console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
  console.log("")
}}