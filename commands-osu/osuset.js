module.exports = {
    name: 'osuset',
    description: 'Sets the osu! username of the user\n' + 
    'Command: `sbr-osuset <username>`\n' +
    'Slash Command: `/osuset [username] [mode]`\n' + 
    'Options:\n' +
    '⠀⠀`username`: string, required. The osu! username of the user\n' +
    '⠀⠀`mode`: string, optional. The mode of the user. If omitted, the default mode \'osu\' will be used.\n',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) { }

        if (interaction != null) {
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
                } catch (error) {
                    affectedRows = await userdata.update({
                        osuname: username,
                        mode: 'osu',
                    }, { where: { userid: interaction.member.user.id } })
                    if (affectedRows > 0) {
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
                } catch (error) {
                    affectedRows = await userdata.update({
                        osuname: username,
                        mode: mode,
                    }, { where: { userid: interaction.member.user.id } })
                    if (affectedRows > 0) {
                        return interaction.reply('updated the database')
                    }
                    return interaction.reply('failed to update the database')


                }
            }
        }
    }
}