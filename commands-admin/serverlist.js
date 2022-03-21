module.exports = {
    name: 'serverlist',
    description: '',
    execute(interaction, options, client, Discord, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        interaction.reply('getting data...')
        if(interaction.member.user.id == '503794887318044675'){
        client.guilds.cache.forEach(guild => {
            let guildembed = new Discord.MessageEmbed()
            .setTitle('Guild Info of ' + guild.name + ' | ' + guild.id)
            .setDescription(`Owned by <@${guild.ownerId}> | ${guild.ownerId} \n${guild.memberCount} members. created ${guild.createdAt}`)
            interaction.channel.send({ embeds: [guildembed]});
        })}
        else interaction.channel.send('insufficient permissions')
        /*
        client.guilds.cache.forEach(guild => {
            let guildembed = new Discord.MessageEmbed()
            interaction.channel.send(`${guild.name} | ${guild.id} \nOwned by ${guild.ownerId} <@${guild.ownerId}>`);
        })*/
        
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - serverlist")
        console.log("category - admin")
        let consoleloguserweeee = interaction.member.user
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)