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
        let absoluteID = currentDate.getTime()
        
        if (message != null) {
            let username = args.join(' ')
            if (!args[0]) return message.reply({ content: 'Please enter a username or ID', allowedMentions: { repliedUser: false }, failIfNotExists: true })
            //message.reply({ content: 'please use the slash command instead', allowedMentions: { repliedUser: false }, failIfNotExists: true })
            try {
                await userdata.create({
                    userid: message.author.id,
                    osuname: username,
                    mode: 'osu',
                })
                message.reply({ content: 'added to the database', allowedMentions: { repliedUser: false } })
                fs.appendFileSync(`commands.log`, `\nsuccess\n\n`, 'utf-8')
                fs.appendFileSync(`commands.log`, `\nCommand Information\nusername: ${username}\n`)
                let endofcommand = new Date().getTime();
                let timeelapsed = endofcommand - currentDate.getTime();
                fs.appendFileSync(`commands.log`, `\nCommand Latency - ${timeelapsed}ms\n`)

            } catch (error) {
                let affectedRows = await userdata.update({
                    osuname: username,
                    mode: 'osu',
                }, { where: { userid: message.author.id } })
                if (affectedRows > 0) {
                    fs.appendFileSync(`commands.log`, `\nsuccess\n\n`, 'utf-8')
                    fs.appendFileSync(`commands.log`, `\nCommand Information\nusername: ${username}`)
                    let endofcommand = new Date().getTime();
                    let timeelapsed = endofcommand - currentDate.getTime();
                    fs.appendFileSync(`commands.log`, `\nCommand Latency - ${timeelapsed}ms\n`)
                    return message.reply({ content: 'updated the database', allowedMentions: { repliedUser: false } })
                }
                let endofcommand = new Date().getTime();
                let timeelapsed = endofcommand - currentDate.getTime();
                fs.appendFileSync(`commands.log`, `\nCommand Latency - ${timeelapsed}ms\n`)
                return message.reply({ content: 'failed to update the database', allowedMentions: { repliedUser: false } })


            }
        }

        if (interaction != null) {
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - osuset (interaction)\n${currentDate} | ${currentDateISO}\n recieved set osu! username command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            fs.appendFileSync(`commands.log`, `\nInteraction ID: ${interaction.id}`)
            fs.appendFileSync(`commands.log`,
                `\noptions:
            user: ${interaction.options.getString('user')}
            mode: ${interaction.options.getString('mode')}
            `)
            let username = interaction.options.getString('user');
            let mode = interaction.options.getString('mode') + '';
            let skin = interaction.options.getString('skin');
            if (mode.length < 1 && !skin) {
                try {
                    await userdata.create({
                        userid: interaction.member.user.id,
                        osuname: username,
                        mode: 'osu',
                    })
                    interaction.reply({ content: 'added to the database', allowedMentions: { repliedUser: false } })
                    fs.appendFileSync(`commands.log`, `\nsuccess - Interaction ID: ${interaction.id}\n\n`, 'utf-8')
                    fs.appendFileSync(`commands.log`, `\nCommand Information\nusername: ${username}\nmode: ${mode}`)

                    let endofcommand = new Date().getTime();
                    let timeelapsed = endofcommand - currentDate.getTime();
                    fs.appendFileSync(`commands.log`, `\nCommand Latency - ${timeelapsed}ms\n`)
                } catch (error) {
                    let affectedRows = await userdata.update({
                        osuname: username,
                        mode: 'osu',
                    }, { where: { userid: interaction.member.user.id } })
                    if (affectedRows > 0) {
                        fs.appendFileSync(`commands.log`, `\nsuccess - ${interaction.id}\n\n`, 'utf-8')
                        fs.appendFileSync(`commands.log`, `\nCommand Information\nusername: ${username}\nmode: ${mode}`)
                        let endofcommand = new Date().getTime();
                        let timeelapsed = endofcommand - currentDate.getTime();
                        fs.appendFileSync(`commands.log`, `\nCommand Latency - ${timeelapsed}ms\n`)
                        return interaction.reply({ content: 'updated the database', allowedMentions: { repliedUser: false } })
                    }
                    let endofcommand = new Date().getTime();
                    let timeelapsed = endofcommand - currentDate.getTime();
                    fs.appendFileSync(`commands.log`, `\nCommand Latency - ${timeelapsed}ms\n`)
                    return interaction.reply({ content: 'failed to update the database', allowedMentions: { repliedUser: false } })
                }
            }
            else if (!skin) {
                try {
                    await userdata.create({
                        userid: interaction.member.user.id,
                        osuname: username,
                        mode: mode,
                    })
                    interaction.reply({ content: 'added to the database', allowedMentions: { repliedUser: false } })
                    fs.appendFileSync(`commands.log`, `\nsuccess - ${interaction.id}\n\n`, 'utf-8')
                    fs.appendFileSync(`commands.log`, `\nCommand Information\nusername: ${username}\nmode: ${mode}`)
                    let endofcommand = new Date().getTime();
                    let timeelapsed = endofcommand - currentDate.getTime();
                    fs.appendFileSync(`commands.log`, `\nCommand Latency - ${timeelapsed}ms\n`)

                } catch (error) {
                    let affectedRows = await userdata.update({
                        osuname: username,
                        mode: mode,
                    }, { where: { userid: interaction.member.user.id } })
                    if (affectedRows > 0) {
                        fs.appendFileSync(`commands.log`, `\nsuccess - ${interaction.id}\n\n`, 'utf-8')
                        fs.appendFileSync(`commands.log`, `\nCommand Information\nusername: ${username}\nmode: ${mode}`)
                        let endofcommand = new Date().getTime();
                        let timeelapsed = endofcommand - currentDate.getTime();
                        fs.appendFileSync(`commands.log`, `\nCommand Latency - ${timeelapsed}ms\n`)
                        return interaction.reply({ content: 'updated the database', allowedMentions: { repliedUser: false } })
                    }
                    let endofcommand = new Date().getTime();
                    let timeelapsed = endofcommand - currentDate.getTime();
                    fs.appendFileSync(`commands.log`, `\nCommand Latency - ${timeelapsed}ms\n`)
                    return interaction.reply({ content: 'failed to update the database', allowedMentions: { repliedUser: false } })


                }
            }
            else if (skin) {
                try {
                    await userdata.create({
                        userid: interaction.member.user.id,
                        osuname: username,
                        mode: mode,
                        skin: skin
                    })
                    interaction.reply({ content: 'added skin to the database', allowedMentions: { repliedUser: false } })
                    fs.appendFileSync(`commands.log`, `\nsuccess - ${interaction.id}\n\n`, 'utf-8')
                    fs.appendFileSync(`commands.log`, `\nCommand Information\nusername: ${username}\nmode: ${mode}`)
                    let endofcommand = new Date().getTime();
                    let timeelapsed = endofcommand - currentDate.getTime();
                    fs.appendFileSync(`commands.log`, `\nCommand Latency - ${timeelapsed}ms\n`)

                } catch (error) {
                    let affectedRows = await userdata.update({
                        osuname: username,
                        mode: mode,
                        skin: skin
                    }, { where: { userid: interaction.member.user.id } })
                    if (affectedRows > 0) {
                        fs.appendFileSync(`commands.log`, `\nsuccess - ${interaction.id}\n\n`, 'utf-8')
                        fs.appendFileSync(`commands.log`, `\nCommand Information\nusername: ${username}\nmode: ${mode}`)
                        let endofcommand = new Date().getTime();
                        let timeelapsed = endofcommand - currentDate.getTime();
                        fs.appendFileSync(`commands.log`, `\nCommand Latency - ${timeelapsed}ms\n`)
                        return interaction.reply({ content: 'updated the database', allowedMentions: { repliedUser: false } })
                    }
                    let endofcommand = new Date().getTime();
                    let timeelapsed = endofcommand - currentDate.getTime();
                    fs.appendFileSync(`commands.log`, `\nCommand Latency - ${timeelapsed}ms\n`)
                    return interaction.reply({ content: 'failed to update the database', allowedMentions: { repliedUser: false } })


                }
            }
        }
    }
}