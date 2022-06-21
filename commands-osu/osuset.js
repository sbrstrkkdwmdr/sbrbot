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
            message.reply('please use the slash command instead')
        }

        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - osuset (interaction)\n${currentDate} | ${currentDateISO}\n recieved set osu! username command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            let username = interaction.options.getString('user');
            let mode = interaction.options.getString('mode') + '';

            if (mode.length < 1) {
                try {
                    await userdata.create({
                        userid: interaction.member.user.id,
                        osuname: username,
                        mode: 'osu',
                    })
                    interaction.reply('added to the database')
                    fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')

                } catch (error) {
                    affectedRows = await userdata.update({
                        osuname: username,
                        mode: 'osu',
                    }, { where: { userid: interaction.member.user.id } })
                    if (affectedRows > 0) {
                        fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')

                        return interaction.reply('updated the database')
                    }
                    return interaction.reply('failed to update the database')
                }
            }
            else {
                try {
                    await userdata.create({
                        userid: interaction.member.user.id,
                        osuname: username,
                        mode: mode,
                    })
                    interaction.reply('added to the database')
                    fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')

                } catch (error) {
                    affectedRows = await userdata.update({
                        osuname: username,
                        mode: mode,
                    }, { where: { userid: interaction.member.user.id } })
                    if (affectedRows > 0) {
                        fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')

                        return interaction.reply('updated the database')
                    }
                    return interaction.reply('failed to update the database')


                }
            }
        }
    }
}