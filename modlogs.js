module.exports = (client, Discord, osuauthtoken, osuapikey, osuclientid, osuclientsecret, trnkey, ytdl, monitorEventLoopDelay, setInterval) => {
    const { loggingchannel } = require('./config.json');
    let logchannel = client.channels.cache.get(loggingchannel)

    client.on('messageDelete', async message => {
        if (message.channel == logchannel) return;
        if (message.author.bot) return;
        //console.log('your mum>??')
        console.log("message by " + message.author.id + " was deleted!")
        console.log(message.content)
        let embed = new Discord.MessageEmbed()
            .setTitle("Deleted Message")
            .setAuthor(`${message.author.id} @${message.author.tag}`)
            .addField(`Info`, `${message.channel.name} | ${message.channelId}\nGuild - ${message.channel.guild} | ${message.channel.guildId}`, false)
            .addField('Deleted Message', `${message.content.toString()}`, false)
        logchannel.send({ embeds: [embed] })
    })
    client.on('messageDeleteBulk', messages => {
        for (i = 0; i < messages.length; i++) {
            console.log(`1 new deleted message by ${messages[i].author.id} @${messages[i].author.tag}\n${messages[i].content}`)
            let embed = new Discord.MessageEmbed()
                .setTitle("Deleted Message")
                .setAuthor(`${messages[i].author.id} @${messages[i].author.tag}`)
                .addField('Deleted Message', `${messages[i].content.toString()}`, false)
            logchannel.send({ embeds: [embed] })
        }
    })
    client.on('roleCreate', role => {
        role.createdAt
        role.createdTimestamp
        role.id
        role.name
        role.guild.id
        console.log(`
    New Role created!
    ${role.name} | ${role.id}
    @${role.createdAt} | ${role.createdTimestamp}
    created in guild - ${role.guild.name} | ${role.guild.id}
    `)
        let embed = new Discord.MessageEmbed()
            .setTitle("Role Created")
            .setAuthor(`${role.name} | ${role.id}`)
            .addField('Guild', `${role.guild.name} | ${role.guild.id}`, false)
            .addField('Role Info', `@${role.createdAt} | ${role.createdTimestamp}\n${role.permissions}`, false)
        logchannel.send({ embeds: [embed] })
    })
    client.on('roleDelete', role => {
        console.log(`
    Role deleted!
    ${role.name} | ${role.id}
    @${role.createdAt} | ${role.createdTimestamp}
    deleted in guild - ${role.guild.name} | ${role.guild.id}
    `)
        let embed = new Discord.MessageEmbed()
            .setTitle("Role Deleted")
            .setAuthor(`${role.name} | ${role.id}`)
            .addField('Guild', `${role.guild.name} | ${role.guild.id}`, false)
            .addField('Role Info', `@${role.createdAt} | ${role.createdTimestamp}\n${role.permissions}`, false)
        logchannel.send({ embeds: [embed] })
    })
    client.on('roleUpdate', (oldRole, newRole) => {
        console.log(`
    Role updated!
    ${oldRole.name} | ${oldRole.id}
    =>
    ${newRole.name} | ${newRole.id}
    @${oldRole.createdAt} | ${oldRole.createdTimestamp}
    updated in guild - ${oldRole.guild.name} | ${oldRole.guild.id}
    `)
        perms = ''
        if (oldRole.permissions != newRole.permissions) {
            oldrollperm = oldRole.permissions.FLAGS.toString()
            newroleperm = newRole.permissions.FLAGS.toString()
            perms = `${oldrollperm} => ${newroleperm}`
        }
        let embed = new Discord.MessageEmbed()
            .setTitle("Role Deleted")
            //.setAuthor(`${role.name} | ${role.id}`)
            .addField('Guild', `${oldRole.guild.name} | ${oldRole.guild.id}`, false)
            .addField('Info', `${oldRole.name} => ${newRole.name} | ${oldRole.id}\n${perms}`, false)
        logchannel.send({ embeds: [embed] })
    })
}