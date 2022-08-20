import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
module.exports = {
    name: 'leaveguild',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let guild;
        let doleave = false;
        if (message != null && interaction == null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - leaveGuild (message)
${currentDate} | ${currentDateISO}
recieved leaveGuild command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            guild = message.guild;
            if (args[0]) {
                guild = client.guilds.cache.get(args[0])
            }
            if (cmdchecks.isOwner(message.author.id)) {
                doleave = true;
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - leaveGuild (interaction)
${currentDate} | ${currentDateISO}
recieved leaveGuild command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            guild = interaction.guild;
            guild = client.guilds.cache.get(interaction.options.getString('guild'));
            if (cmdchecks.isOwner(interaction.member.user.id)) {
                doleave = true;
            }
        }


        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - leaveGuild (interaction)
${currentDate} | ${currentDateISO}
recieved leaveGuild command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }
        //checking for errors==============================================================================================================================================================================================

        try {
            guild.id
        } catch (error) {
            obj.reply({
                content: 'Error - no guild found',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });
            return;
        }

        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}
Guild ID: ${guild.id}
Do Leave: ${doleave}
----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        let ctx;
        if (doleave == true) {
            ctx = 'Leaving guild...';
        } else {
            ctx = 'Error - you do not have permission to use this command';
        }


        //SEND/EDIT MSG==============================================================================================================================================================================================

        if ((message != null || interaction != null) && button == null) {
            obj.reply({
                content: ctx,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }
        if (button != null) {
            message.edit({
                content: '',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }
        if (doleave == true) {
            guild.leave();
        }

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}