import fs = require('fs')
module.exports = {
    name: 'osuset',
    description: 'Sets the osu! username of the user\n' +
        'Command: `sbr-osuset <username>`\n' +
        'Slash Command: `/osuset [username] [mode]`\n' +
        'Options:\n' +
        '⠀⠀`username`: string, required. The osu! username of the user\n' +
        '⠀⠀`mode`: string, optional. The mode of the user. If omitted, the default mode \'osu\' will be used.\n',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            message.reply({ content: 'please use the slash command instead', allowedMentions: { repliedUser: false } })
        }

        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - osuset (interaction)\n${currentDate} | ${currentDateISO}\n recieved set osu! username command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            fs.appendFileSync('commands.log', `\nInteraction ID: ${interaction.id}`)
            fs.appendFileSync('commands.log', 
            `\noptions:
            user: ${interaction.options.getString('user')}
            mode: ${interaction.options.getString('mode')}
            `)
            let username = interaction.options.getString('user');
            let mode = interaction.options.getString('mode') + '';

            if (mode.length < 1) {
                try {
                    await userdata.create({
                        userid: interaction.member.user.id,
                        osuname: username,
                        mode: 'osu',
                    })
                    interaction.reply({ content: 'added to the database', allowedMentions: { repliedUser: false } })
                    fs.appendFileSync('commands.log', `\nsuccess - Interaction ID: ${interaction.id}\n\n`, 'utf-8')
                    fs.appendFileSync('commands.log', `\nCommand Information\nusername: ${username}\nmode: ${mode}`)


                } catch (error) {
                    let affectedRows = await userdata.update({
                        osuname: username,
                        mode: 'osu',
                    }, { where: { userid: interaction.member.user.id } })
                    if (affectedRows > 0) {
                        fs.appendFileSync('commands.log', `\nsuccess - ${interaction.id}\n\n`, 'utf-8')
                        fs.appendFileSync('commands.log', `\nCommand Information\nusername: ${username}\nmode: ${mode}`)

                        return interaction.reply({ content: 'updated the database', allowedMentions: { repliedUser: false } })
                    }
                    return interaction.reply({ content: 'failed to update the database', allowedMentions: { repliedUser: false } })
                }
            }
            else {
                try {
                    await userdata.create({
                        userid: interaction.member.user.id,
                        osuname: username,
                        mode: mode,
                    })
                    interaction.reply({ content: 'added to the database', allowedMentions: { repliedUser: false } })
                    fs.appendFileSync('commands.log', `\nsuccess - ${interaction.id}\n\n`, 'utf-8')
                    fs.appendFileSync('commands.log', `\nCommand Information\nusername: ${username}\nmode: ${mode}`)


                } catch (error) {
                    let affectedRows = await userdata.update({
                        osuname: username,
                        mode: mode,
                    }, { where: { userid: interaction.member.user.id } })
                    if (affectedRows > 0) {
                        fs.appendFileSync('commands.log', `\nsuccess - ${interaction.id}\n\n`, 'utf-8')
                        fs.appendFileSync('commands.log', `\nCommand Information\nusername: ${username}\nmode: ${mode}`)

                        return interaction.reply({ content: 'updated the database', allowedMentions: { repliedUser: false } })
                    }
                    return interaction.reply({ content: 'failed to update the database', allowedMentions: { repliedUser: false } })


                }
            }
        }
    }
}