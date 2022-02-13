const roles = ['Ultimate Ruler']
const { loggingchannel } = require('./config.json');
const Discord = require('discord.js'); //uses discord.js to run

module.exports = (client) => {
    client.on('messageCreate', message => {
        let logchannel = client.channels.cache.get(loggingchannel)
        let messagedetect = message.content
        let messageattachementdetect = message.attachments
        let msgguild = message.channel.guild
        let msgguildid = message.channel.guildId
        let msgchannelid = message.channelId
        let msgchannel = message.channel.name

        

        let { content, member } = message

        let rolecheck = member.roles.cache.find((role) => {
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
            .addField('**MESSAGE SENT BY**', `<@${member.id}> | ${member.id}\n CHANNEL #${msgchannel} | ${msgchannelid}\n GUILD        ${msgguild} | ${msgguildid}`, true)
            .addField('**roles**', `${rolecheck}`, true)
            .addField('**MESSAGE CONTENT**', `${content}`, false)

        logchannel.send({ embeds: [Embed]})
    }
    })
    client.on('messageDelete', async message => {
        //if (!message.guild) return;
        let logchannel = client.channels.cache.get(loggingchannel)
        let messagedetect = message.content
        let messageattachementdetect = message.attachments
        let msgguild = message.channel.guild
        let msgguildid = message.channel.guildId
        let msgchannelid = message.channelId
        let msgchannel = message.channel.name
        let { content, member } = message

        if (!message.guild) return;
        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_DELETE',
        });

        const deletionLog = fetchedLogs.entries.first();
    
        if (!deletionLog) {console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);}
    
        //let memberroles = (member.roles.cache).toString();
        //console.log(memberroles)

        let Embeddel = new Discord.MessageEmbed()
            .setTitle(`deleted message`)
            .addField('**MESSAGE SENT BY**', `<@${member.id}> | ${member.id}\n CHANNEL #${msgchannel} | ${msgchannelid}\n GUILD        ${msgguild} | ${msgguildid}`, true)
            .addField('**roles**', `unknown`, true)
            .addField('**MESSAGE CONTENT**', `${content}`, false);

        logchannel.send({ embeds: [Embeddel]})

    })
    client.on('guildBanAdd', async ban => {
        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        });
        console.log('ban')
        const banLog = fetchedLogs.entries.first();
    
        if (!banLog) return console.log(`${ban.user.tag} was banned from ${ban.guild.name} but no audit log could be found.`);
    
        const { executor, target, reason } = banLog;
    
          if (target.id === ban.user.id) {
            console.log(`${ban.user.tag} was banned in ${ban.guild.name} by ${executor.tag}`);
        } else {
            console.log(`${ban.user.tag}  was banned in ${ban.guild.name}`);
        }

        if(!reason){
            re = 'unknown reason'
        }
        if(reason){
            re = reason
        }

        let Embedban = new Discord.MessageEmbed()
        .setTitle(`banned user`)
        .addField('**USER BANNED**', `<@${member.user.id}> | ${member.user.id} | ${member.user.tag}`, true)
        .addField('**BANNED BY**', `<@${executor.id}> | ${executor.id} \nGUILD: ${ban.guild} | ${ban.guildId}`)
        //.addField('**roles**', `${memberroles}`, true)
        .addField('**REASON**', `${re}`, false);

        logchannel.send({ embeds: [Embedban]})
    })
    client.on('guildBanRemove', async ban => {
        console.log('unban')
        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_REMOVE',
        });
        const unbanLog = fetchedLogs.entries.first();
    
        if (!unbanLog) return console.log(`${ban.user.tag} was unbanned from ${ban.guild.name} but no audit log could be found.`);
    
        const { executor, target, reason } = unbanLog;
    
          if (target.id === ban.user.id) {
            console.log(`${ban.user.tag} was unbanned in ${ban.guild.name} by ${executor.tag}`);
        } else {
            console.log(`${ban.user.tag} was unbanned in ${ban.guild.name}`);
        }

        let Embedunban = new Discord.MessageEmbed()
        .setTitle(`unbanned user`)
        .addField('**USER UNBANNED**', `<@${member.user.id}> | ${member.user.id} | ${member.user.tag}`, true)
        .addField('**UNBANNED BY**', `<@${executor.id}> | ${executor.id} \nGUILD: ${ban.guild} | ${ban.guildId}`)
        //.addField('**roles**', `${memberroles}`, true)
        //.addField('**REASON**', `${re}`, false);

        logchannel.send({ embeds: [Embedunban]})
    })
    //guildMemberUpdate

    client.on('guildMemberRemove', async member => {
        //if (!message.guild) return;
        let logchannel = client.channels.cache.get(loggingchannel)

        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });
        const kickLog = fetchedLogs.entries.first();
    
        if (!kickLog) return console.log(`${member.user.tag} left the guild, most likely of their own will.`);
    
        const { executor, target, reason } = kickLog;

        if(!reason){
            re = 'unknown reason'
        }
        if(reason){
            re = reason
        }

        if (target.id === member.id) {
            console.log(`${member.user.tag} left the guild; kicked by ${executor.tag}`);
            let Embedkick = new Discord.MessageEmbed()
            .setTitle(`kicked user`)
            .addField('**KICKED USER**', `<@${member.user.id}> | ${member.user.id} | ${member.user.tag}`, true)
            .addField('**KICKED BY**', `<@${executor.id}> | ${executor.id}\nGUILD: ${member.guild}`, true)
            //.addField('**roles**', `${memberroles}`, true)
            .addField('**REASON**', `${re}`, false);

        logchannel.send({ embeds: [Embedkick]})
        } else {
            console.log(`${member.user.tag} left the guild, audit log fetch was inconclusive.`);
            let Embedleave = new Discord.MessageEmbed()
            .setTitle(`user left`)
            .addField('**user**', `<@${member.user.id}> | ${member.user.id} | ${member.user.tag}\nGUILD: ${member.guild}`, true)
            //.addField('**KICKED BY**', `<@${executor.id}> | ${executor.id}\nGUILD: ${member.guild}`)
            //.addField('**roles**', `${memberroles}`, true)
            //.addField('**REASON**', `${re}`, false);

        logchannel.send({ embeds: [Embedleave]});
        }
        
        

    })
    
    ;

}