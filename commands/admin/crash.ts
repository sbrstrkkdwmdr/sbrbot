import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
module.exports = {
    name: 'crash',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        if (message != null && interaction == null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - crash (message)
${currentDate} | ${currentDateISO}
recieved crash command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            if (cmdchecks.isOwner(message.author.id)) {
                console.log('crash command triggered')
                message.channel.send('💀今死します💀')
                setTimeout(() => {
                    for (let i = 0; i < 100; i++) {
                        message.reply('Running crash command...')
                        message.delete();
                        message.reply('balls??')
                    }
                }, 1000)
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - crash (interaction)
${currentDate} | ${currentDateISO}
recieved crash command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            if (cmdchecks.isOwner(message.author.id)) {
                console.log('crash command triggered')
                message.channel.send('💀今死します💀')
                setTimeout(() => {
                    for (let i = 0; i < 100; i++) {
                        message.reply('Running crash command...')
                        message.delete();
                        message.reply('balls??')
                    }
                }, 1000)
            }
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - COMMANDNAME (interaction)
${currentDate} | ${currentDateISO}
recieved COMMANDNAME command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================


        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
success
ID: ${absoluteID}
\n\n`, 'utf-8')
    }
}