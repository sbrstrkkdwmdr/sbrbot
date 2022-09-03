const fs = require('fs')
const voice = require('@discordjs/voice')

module.exports = {
    name: 'sfx',
    description: 'plays a sound',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction){
        if(message != null){
            const connection = voice.joinVoiceChannel({
                channelId: '724514625005158404',
                guildId: '724514625005158400',
                adapterCreator: message.channel.guild.voiceAdapterCreator,
            })
            const player = voice.createAudioPlayer({
                behaviors: {
                    noSubscriber: voice.NoSubscriberBehavior.Pause,
                }
            })
            const audiotoplay = voice.createAudioResource('../files/audio/test.wav');
            player.play(audiotoplay)

            connection.subscribe(player);
        }
/*         if(interaction != null){

        } */
    }
}