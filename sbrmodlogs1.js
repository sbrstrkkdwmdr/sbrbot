const roles = ['Ultimate Ruler']
const { loggingchannel } = require('./config.json');
const Discord = require('discord.js'); //uses discord.js to run

module.exports = (client) => {
    client.on('messageCreate', message => {


        const logchannel = client.channels.cache.get(loggingchannel)
        const messagedetect = message.content
        const messageattachementdetect = message.attachments
        const msgguild = message.channel.guild
        const msgguildid = message.channel.guildId
        const msgchannelid = message.channelId
        const msgchannel = message.channel.name

        const { content, member } = message

        const rolecheck = member.roles.cache.find((role) => {
            return roles.includes(role.name)
        })

        if(rolecheck == 'undefined') return;
        if(member.user.bot) {
            return
        }
        //if(message.content.startsWith('balls'))

        if(rolecheck && content.includes('ban', 'kick')){
        console.log('has role = ' + rolecheck)
        console.log('message sent in #' + msgchannel + ' | ' + msgchannelid)
        console.log('message sent by ' + member.tag + ' | ' + member.id)
        console.log(content)
        console.log('')

        let Embed = new Discord.MessageEmbed()
            .setTitle(`new log`)
            .addField('**MESSAGE SENT BY**', `<@${member.id}> | ${member.id} | ${member.tag}`, true)
            .addField('**roles**', `${rolecheck}`, true)
            .addField('**MESSAGE CONTENT**', `${content}`, false)

        logchannel.send({ embeds: [Embed]})
    }
    })
}