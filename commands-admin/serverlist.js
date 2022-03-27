const fs = require('fs')
module.exports = {
    name: 'serverlist',
    description: '',
    execute(interaction, options, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync('admincmd.log', "\n" + '--- COMMAND EXECUTION ---')
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
        
        fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('admincmd.log', "\n" + "command executed - serverlist")
        fs.appendFileSync('admincmd.log', "\n" + "category - admin")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('admincmd.log', "\n" + "")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)