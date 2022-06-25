const commandchecks = require('../configs/commandchecks.js');
const fs = require('fs')
module.exports = {
    name: 'leaveguild',
    description: 'Leaves the guild\n' +
        'Command: `sbr-leaveguild <id>`\n' +
        'Slash Command: `/leaveguild [id]`\n' +
        'Options: \n' +
        '    `guild`: integer, required. The id of the guild to leave\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        //config.ownerusers
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - LEAVEGUILD (message)\n${currentDate} | ${currentDateISO}\n recieved LEAVEGUILD command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            if (args[0]) {
                guild = client.guilds.cache.get(args[0])
            }
            else {
                guild = message.guild
            }
            if (commandchecks.isOwner(message.author.id)) {
                message.reply('Leaving guild...')
                guild.leave()
                fs.appendFileSync('commands.log', 'success\n\n', 'utf-8')
                fs.appendFileSync('commands.log', `left guild ${guild.name} | ${guild.id}`, 'utf-8')
                fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)

            } else {
                message.reply('Error - you do not have the permissions to use this command')
                fs.appendFileSync('commands.log', 'failed\n\n', 'utf-8')
                fs.appendFileSync('commands.log', `${message.author.id} is not an owner`, 'utf-8')
                fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)

            }
        }
        if (interaction != null) {
            interaction.reply('command error - guild IDs are too long to be used in interactions. Please use the message version of this command.')
            return
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - LEAVEGUILD (interaction)\n${currentDate} | ${currentDateISO}\n recieved LEAVEGUILD command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            let guildid = interaction.options.get('guild')
            let guild = client.guilds.cache.get(guildid)
            //leave guild
            if (commandchecks.isOwner(interaction.member.user.id)) {
                interaction.reply('Leaving guild...')
                guild.leave()
                fs.appendFileSync('commands.log', 'success\n\n', 'utf-8')
                fs.appendFileSync('commands.log', `left guild ${guild.name} | ${guild.id}`, 'utf-8')
            } else {
                interaction.reply('Error - you do not have the permissions to use this command')
                fs.appendFileSync('commands.log', 'failed\n\n', 'utf-8')
                fs.appendFileSync('commands.log', `${interaction.member.user.id} is not an owner`, 'utf-8')
            }


        }
    }
}