import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
module.exports = {
    name: 'log',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let guildid;
        let curuserid;
        if (message != null && interaction == null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - log (message)
${currentDate} | ${currentDateISO}
recieved log command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            curuserid = message.author.id;
            guildid = message.guild.id;
            if (args[0] && !isNaN(parseInt(args[0]))) {
                guildid = args[0];
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - log (interaction)
${currentDate} | ${currentDateISO}
recieved log command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            curuserid = interaction.member.user.id;
            guildid = interaction.options.getString('guildid');
            if (isNaN(parseInt(guildid))) {
                guildid = interaction.guild.id;
            }
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - log (interaction)
${currentDate} | ${currentDateISO}
recieved log command
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
Guild ID: ${guildid}
User ID: ${curuserid}
----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        if (!(cmdchecks.isAdmin(curuserid, obj.guildId, client) || cmdchecks.isOwner(curuserid))) {
            if ((message != null || interaction != null) && button == null) {
                obj.reply({
                    content: 'Error - you do not have permission to use this command.',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch(error => { });

            }
            if (button != null) {
                message.edit({
                    content: 'Error - you do not have permission to use this command.',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        } else {
            let guildname = 'null_name';
            const logfiles = []
            if (client.guilds.cache.has(guildid)) {
                guildname = client.guilds.cache.get(guildid).name;
            }

            if (fs.existsSync(`./logs/moderator/${guildid}.log`)) {
                logfiles.push(`./logs/moderator/${guildid}.log`);
            }
            if (fs.existsSync(`./logs/cmd/commands${guildid}.log`)) {
                logfiles.push(`./logs/cmd/commands${guildid}.log`);
            }
            if (fs.existsSync(`./logs/cmd/link${guildid}.log`)) {
                logfiles.push(`./logs/cmd/link${guildid}.log`);
            }
            if (fs.existsSync(`./logs/gen/imagerender${guildid}.log`)) {
                logfiles.push(`./logs/gen/imagerender${guildid}.log`);
            }
            let txt;
            if (logfiles.length > 0) {
                txt = `Logs for **${guildname}** \`${guildid}\``;
            } else {
                txt = `Error - no logs found for server \`${guildid}\``
            }

            //SEND/EDIT MSG==============================================================================================================================================================================================
            if ((message != null || interaction != null) && button == null) {
                obj.reply({
                    content: txt,
                    files: logfiles,
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
            }
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