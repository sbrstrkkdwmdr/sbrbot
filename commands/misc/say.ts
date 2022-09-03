import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
const defaulttext = require('../../configs/w').chocomint

module.exports = {
    name: 'say',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let msg;
        let channel;
        let uid;

        if (message != null && interaction == null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - say (message)
${currentDate} | ${currentDateISO}
recieved say command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            channel = message.channel;
            uid = message.author.id;
            msg = args.join(' ');
            if (!args[0]) {
                msg = defaulttext;
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - say (interaction)
${currentDate} | ${currentDateISO}
recieved say command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            uid = interaction.member.user.id;
            msg = interaction.options.getString('message');
            channel = interaction.channel;
            if (interaction.options.getChannel('channel')) {
                channel = interaction.options.getChannel('channel');
            }
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - say (interaction)
${currentDate} | ${currentDateISO}
recieved say command
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
channel: ${channel.id}
uid: ${uid}
msg: ${msg}
----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        let ltxt = '';
        if (cmdchecks.isOwner(uid)) {
            ltxt = 'success'
            channel.send(msg == defaulttext ? {
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(colours.embedColour.info.hex)
                        .setDescription(defaulttext)
                ]
            } : msg);
        } else {
            ltxt = 'L + ratio + no permissions 🥺🥺🥺'
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================

        if (message != null && interaction == null && button == null) {
            message.delete();
        }
        if (interaction != null && button == null && message == null) {
            interaction.reply({
                content: ltxt,
                ephemeral: true,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

        }
        if (button != null) {
            message.edit({
                content: '',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

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