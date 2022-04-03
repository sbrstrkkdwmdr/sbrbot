const fs = require('fs')
const { adminlogdir } = require('../logconfig.json')
module.exports = {
    name: 'serverlist',
    description: '',
    execute(interaction, options, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync(adminlogdir, "\n" + '--- COMMAND EXECUTION ---')
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
        
        fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(adminlogdir, "\n" + "command executed - serverlist")
        fs.appendFileSync(adminlogdir, "\n" + "category - admin")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(adminlogdir, "\n" + "")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)