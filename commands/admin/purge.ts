import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
module.exports = {
    name: 'purge',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let totalmessagecount;
        let filteruser = null;
        let curuserid;
        if (message != null && interaction == null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - purge (message)
${currentDate} | ${currentDateISO}
recieved purge command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            if (args[0] != null) {
                if (!isNaN(args[0])) {
                    totalmessagecount = parseInt(args[0]);
                }
            } else if (args[1] != null && !isNaN(args[1])) {
                totalmessagecount = parseInt(args[1]);
            } else if (args[2] != null && !isNaN(args[2])) {
                totalmessagecount = parseInt(args[2]);
            }
            if (message.mentions.users.size > 0) {
                filteruser = message.mentions.users.first().id;
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - purge (interaction)
${currentDate} | ${currentDateISO}
recieved purge command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            totalmessagecount = interaction.options.getInteger('count');
            if (interaction.options.getString('filteruser') != null) {
                filteruser = interaction.options.getString('filteruser');
            }
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - purge (interaction)
${currentDate} | ${currentDateISO}
recieved purge command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}
totalmessagecount: ${totalmessagecount}
filteruser: ${filteruser}
----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        if (totalmessagecount > 100) {
            obj.reply({
                content: 'You can only delete up to 100 messages at a time.',
                allowedMentions: {
                    repliedUser: false
                },
                failIfNotExists: true
            })
                .catch(error => { });
            return;
        }
        if (message != null) {
            message.delete();
        }
        if (filteruser != null) {
            obj.channel.messages.fetch({ limit: totalmessagecount })
                .then(messages => {
                    messages.filter(message => message.author.id == filteruser)
                        .forEach(
                            message => {
                                message.delete().catch(error => { });
                            }
                        )
                }).catch(error => { });
        } else {
            obj.channel.messages.fetch({ limit: totalmessagecount })
                .then(messages => {
                    messages.forEach(
                        message => {
                            message.delete().catch(error => { });
                        }
                    )
                }).catch(error => { });
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================

        /*         if (message != null && interaction == null && button == null) {
                    message.reply({
                        content: '',
                        embeds: [],
                        files: [],
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                } */
        if (interaction != null && button == null && message == null) {
            interaction.reply({
                content: 'success',
                ephemeral: true,
                /*                 embeds: [],
                                files: [], */
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


        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}