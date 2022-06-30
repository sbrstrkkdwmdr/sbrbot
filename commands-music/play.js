const discvoice = require('@discordjs/voice')
const ytaudio = require('youtube-audio-stream')
const yts = require('yt-search')
const fs = require('fs')
const { pipeline } = require('stream')
const prism = require('prism-media')

module.exports = {
    name: 'play',
    description: 'Play a song',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - play (message)\n${currentDate} | ${currentDateISO}\n recieved play audio via youtube command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            if (!args.length) {
                return message.channel.send('Please specify the song you want to play.')
            }
            const searching = await yts.search(args.join(' '))
            if (searching.videos.length < 1) {
                return message.channel.send('No results found')
            }
            let vids = searching.videos
            let vidid = vids[0].url.split('=')[1]
            if(!connection){}

        }


    }
}